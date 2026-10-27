import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const statement = {
	...defaultStatements,
	draft: ['create', 'update', 'read'],
	team: ['create', 'update', 'delete'],
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({
	draft: ['read'],
});

const admin = ac.newRole({
	draft: ['create', 'update', 'read'],
	team: ['create', 'update', 'delete'],
	...adminAc.statements,
});

type Permissions = Partial<{
	[K in keyof typeof ac.statements]: Array<(typeof ac.statements)[K][number]>;
}>;

export { user, admin, ac };
export type { Permissions };
