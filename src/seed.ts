import logger from '@/logger';
import { auth } from '@/auth/auth';
import { env } from '@/env/server';
import { faker } from '@faker-js/faker';
import { generateRandomString, symmetricEncrypt } from 'better-auth/crypto';
import { Role, db, draft, playersToDrafts, team, teamsToDrafts, twoFactor } from '@/db';

const arrayOf = (length: number): Array<unknown> => Array.from(Array(length));

const setupCoreUsers = async () => {
	await auth.api.createUser({
		body: {
			email: 'basic@basic.com',
			name: 'Basic',
			password: 'Basic',
			role: Role.user,
			data: {
				username: 'Basic',
			},
		},
	});
	const user = await auth.api.createUser({
		body: {
			email: 'admin@admin.com',
			name: 'Admin',
			password: 'Admin',
			role: 'admin',
			data: {
				username: 'Admin',
				twoFactorEnabled: true
			},
		},
	});
	const secret = generateRandomString(32);
	const encryptedSecret = await symmetricEncrypt({
		key: env.BETTER_AUTH_SECRET,
		data: secret,
	});
	await db.insert(twoFactor).values({
		id: 'ADMIN_TWO_FACTOR',
		userId: user.user.id,
		backupCodes: '',
		secret: encryptedSecret,
		verified: true,
	});
};

const seedUser = async (role: Role) => {
	const name = faker.person.fullName();
	const username = faker.internet
		.username()
		.replace(/[^0-9a-z]/gi, '')
		.substring(0, 15);

	return await auth.api.createUser({
		body: {
			email: `${username}@nuzlocke-wars.com`,
			name: name,
			password: 'password',
			role,
			data: {
				image: 'https://picsum.photos/300/300',
				username: username,
			},
		},
	});
};

const seedDraft = async (usersPerTeam: number, teamCount: number) => {
	const users = await Promise.all(arrayOf(usersPerTeam * teamCount + teamCount).map(() => seedUser(Role.user)));
	const teams = await db
		.insert(team)
		.values(arrayOf(teamCount).map(() => ({ name: faker.company.name().replace(/[^0-9a-z]/gi, '') })))
		.returning({ name: team.name });
	const draftResponse = await db
		.insert(draft)
		.values({
			name: `${faker.animal.type()} Draft`,
			initialPlayerCoins: faker.number.int({ max: 120, min: 30 }),
			maxPlayersPerTeam: faker.number.int({ max: 8, min: 3 }),
			roundLength: faker.number.int({ max: 180, min: 30 }),
		})
		.returning({ id: draft.id });
	const createdDraft = draftResponse.at(0);
	if (!createdDraft) throw new Error('Failed to create draft...');
	const captains = users.slice(0, teamCount);
	const players = users.slice(teamCount);

	await db.insert(playersToDrafts).values(
		players.map(p => ({
			userId: p.user.id,
			draftId: createdDraft.id,
		})),
	);
	await db.insert(teamsToDrafts).values(
		captains.map((c, index) => ({
			teamName: teams[index].name,
			draftId: createdDraft.id,
			captainId: c.user.id,
		})),
	);
};

const main = async () => {
	await setupCoreUsers();
	await seedDraft(2, 2);
	await Promise.all(arrayOf(50).map(() => seedUser(Role.user)));
	await Promise.all(arrayOf(10).map(() => seedUser(Role.admin)));
	// const teams = await db
	// 	.insert(team)
	// 	.values(arrayOf(10).map(() => ({ name: faker.company.name().replace(/[^0-9a-z]/gi, '') })))
	// 	.returning({ name: team.name });
	// const drafts = await db
	// 	.insert(draft)
	// 	.values(
	// 		arrayOf(10).map(() => ({
	// 			name: `${faker.animal.type()} Draft`,
	// 			initialPlayerCoins: faker.number.int({ max: 120, min: 30 }),
	// 			maxPlayersPerTeam: faker.number.int({ max: 8, min: 3 }),
	// 			roundLength: faker.number.int({ max: 180, min: 30 }),
	// 		})),
	// 	)
	// 	.returning({ id: draft.id });
	// const simpleUserIds = await db.select({ id: user.id }).from(user).where(eq(user.role, Role.user));
	// await db.insert(teamsToDrafts).values(
	// 	teams.flatMap(({ name }, index) => {
	// 		const draftId = drafts.at(index);
	// 		const captainId = simpleUserIds.at(index);
	// 		return draftId && captainId ?
	// 				[
	// 					{
	// 						draftId: draftId.id,
	// 						teamName: name,
	// 						captainId: captainId.id,
	// 					},
	// 				]
	// 			:	[];
	// 	}),
	// );
};

main()
	.then(() => logger.info('Successfully seeded db'))
	.catch(e => logger.error(`Failed to seed db ${e}`));
