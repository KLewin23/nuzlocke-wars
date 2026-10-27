import type { auth } from '@/auth/auth';
import { eq, or } from 'drizzle-orm';
import { db, playersToDrafts, teamsToDrafts } from '@/db';

const isInDraftQuery = (session: typeof auth.$Infer.Session) =>
	db
		.select({ data: playersToDrafts.draftId })
		.from(playersToDrafts)
		.fullJoin(teamsToDrafts, eq(playersToDrafts.draftId, teamsToDrafts.draftId))
		.where(or(eq(playersToDrafts.userId, session.user.id), eq(teamsToDrafts.captainId, session.user.id)));

export default isInDraftQuery;
