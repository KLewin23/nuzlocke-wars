import type { CreateDraftPayload } from '@/actions/draft/createDraft';
import type { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

type RHFControl<T extends FieldValues> = Control<T, unknown, T>;
type RHFWatch<T extends FieldValues> = <K extends keyof T>(name: K, defaultValue?: T[K]) => T[K];

interface RHFProps<T extends FieldValues, N extends FieldPath<T>> {
	name: N;
	control: RHFControl<T>;
	rules?: RegisterOptions<T, N>;
}

interface ExistingTeam {
	id: number;
	name: string;
	captain?: User;
}
interface User {
	id: string;
	username: string;
}
type Team = ExistingTeam | { name: string; captain: User };

type CreateDraftForm = Omit<CreateDraftPayload, 'teams'> & {
	teams: Array<Team>;
	newTeamName: string;
	newTeamCaptainUsername: string;
};

export type { RHFControl, RHFWatch, RHFProps, Team, CreateDraftForm, ExistingTeam, User };
