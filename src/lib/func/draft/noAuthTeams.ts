import { auth } from '@/auth/auth';
import buildCRUDError from '@/error/crudError';
import { type Either, eitherOr } from '@/util/either';
import { and, eq, inArray, isNotNull, sum } from 'drizzle-orm';
import { GetCurrentCaptainSpend, GetTeams } from '@/type/queries';
import { bid, db, draft, round, team, user, usersToDrafts } from '@/db';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

// This should really remove the team innerJoin and just check the teamName in usersToDrafts is not null.
// However `isNotNull` doesn't type correctly BUG: https://github.com/drizzle-team/drizzle-orm/issues/2956
const noAuthTeams = async (
	session: typeof auth.$Infer.Session,
	draftId: number,
): Promise<Either<QueryFailureState, Success<GetTeams>>> => {
	const baseQuery = db
		.select({
			userId: usersToDrafts.userId,
			teamName: team.name,
			teamRole: usersToDrafts.teamRole,
			username: user.username,
			image: user.image,
		})
		.from(usersToDrafts)
		.innerJoin(team, eq(usersToDrafts.teamName, team.name))
		.innerJoin(user, eq(usersToDrafts.userId, user.id));

	const usersToDraftResponse = await eitherOr(
		session.user.role === 'user' ?
			baseQuery.where(
				and(
					eq(usersToDrafts.draftId, draftId),
					inArray(
						usersToDrafts.draftId,
						db
							.select({ data: usersToDrafts.draftId })
							.from(usersToDrafts)
							.where(eq(usersToDrafts.userId, session.user.id)),
					),
				),
			)
		:	baseQuery.where(and(eq(usersToDrafts.draftId, draftId))),
		err => buildCRUDError('read', 'users to drafts', err),
	);

	if (usersToDraftResponse._type === 'left') return usersToDraftResponse;

	const re = usersToDraftResponse.value.reduce<GetTeams>((acc, cur) => {
		return {
			...acc,
			[cur.teamName]: {
				captain
			}
		};
	}, {});
};
export default noAuthTeams;

// SELECT users_to_drafts.user_id, team.name, users_to_drafts.team_role, team.name, public."user".username, public."user".image
// FROM users_to_drafts
// JOIN team ON users_to_drafts.team_name = team.name
// JOIN public."user" ON users_to_drafts.user_id = public."user".id
// WHERE users_to_drafts.draft_id = 42
