import { Info } from 'lucide-react';
import { db, team, user } from '@/db';
import Title from '@/atoms/typography/Title';

import AddDraftForm from './AddDraftForm';

const UserForm = async () => {
	const teams = await db.select({ id: team.id, name: team.displayName }).from(team);
	const users = await db.select({ id: user.id, username: user.username }).from(user);

	return (
		<div className="col w-full max-w-250 grow gap-4 self-center overflow-hidden">
			<div className="col gap-2">
				<Title>Create Draft</Title>
				<div className="row items-center gap-2">
					<Info size={23} />
					<p className="font-bold">
						Create or select teams and their players, complete the details and submit your draft.
					</p>
				</div>
			</div>
			<AddDraftForm existingTeams={teams} users={users} />
		</div>
	);
};

export default UserForm;
