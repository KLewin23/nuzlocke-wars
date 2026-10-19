const Role = {
	Basic: 'Basic',
	Admin: 'Admin',
	Super: 'Super',
} as const;

type TRole = (typeof Role)[keyof typeof Role];

export { Role };
export type { TRole };
