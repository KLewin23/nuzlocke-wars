import type { CreateDraftPayload } from '@/actions/draft/createDraft';
import type { Control, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';

import type { ArrElement } from './util';

type RHFControl<T extends FieldValues> = Control<T, unknown, T>;
type RHFWatch<T extends FieldValues> = <K extends keyof T>(name: K, defaultValue?: T[K]) => T[K];

interface RHFProps<T extends FieldValues, N extends FieldPath<T>> {
	name: N;
	control: RHFControl<T>;
	rules?: RegisterOptions<T, N>;
}

interface User {
	id: string;
	username: string;
}
interface Team {
	name: string;
	captain: User;
	isNew: boolean
}

type CreateDraftPayloadOmitLessTeams = Omit<CreateDraftPayload, 'teams'>;

type CreateDraftForm = Omit<CreateDraftPayloadOmitLessTeams, 'players'> & {
	teams: Array<Team>;
	players: Array<ArrElement<CreateDraftPayloadOmitLessTeams['players']> & { username: string }>;
};

export type { RHFControl, RHFWatch, RHFProps, Team, CreateDraftForm, User };
