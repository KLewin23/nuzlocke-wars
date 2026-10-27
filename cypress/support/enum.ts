const Role = {
	Basic: 'Basic',
	Admin: 'Admin',
} as const;

type TRole = (typeof Role)[keyof typeof Role];

export { Role };
export type { TRole };
