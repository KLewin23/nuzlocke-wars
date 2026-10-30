'use client';

import { toast } from 'sonner';
import { Info } from 'lucide-react';
import Title from '@/atoms/typography/Title';
import type { CreatedUser } from '@/type/queries';
import Button from '@/components/atoms/Button';
import { useState, useTransition } from 'react';
import { readableQueryFailure } from '@/util/query';
import type { CreateUserPayload } from '@/type/actions';
import { createUsers } from '@/actions/user/createUsers';
import SubTitle from '@/components/atoms/typography/SubTitle';

import UserForm from './UserForm';
import StagedUserTile from './StagedUserTile';
import CreatedUsersPasswordsDialog from './CreatedUsersPasswordsDialog';

const Page = () => {
	const [currentUserBeingEdited, setCurrentUserBeingEdited] = useState<number | undefined>();
	const [stagedUsers, setStagedUsers] = useState<Array<CreateUserPayload>>([]);
	const [createdUsers, setCreatedUsers] = useState<Array<CreatedUser> | undefined>();
	const [submitPending, startSubmitTransition] = useTransition();


	const submitUsers = () =>
		startSubmitTransition(async () => {
			const response = await createUsers(stagedUsers);
			if (response._type === 'left')
				return startSubmitTransition(() => {
					const failure = readableQueryFailure(response.value);
					toast(failure.title, { description: failure.description });
				});
			return startSubmitTransition(() => {
				setStagedUsers([]);
				toast('Users Created', {
					description: `${stagedUsers.length} ${stagedUsers.length === 1 ? 'user' : 'users'} successfully created.`,
				});
				setCreatedUsers(response.value.data);
			});
		});

	return (
		<div className="col w-full max-w-250 grow gap-4 self-center overflow-hidden">
			<CreatedUsersPasswordsDialog users={createdUsers} onClose={() => setCreatedUsers(undefined)} />
			<div className="col gap-2">
				<Title>Create Users</Title>
				<div className="row items-center gap-2">
					<Info size={23} />
					<p className="font-bold">Fill a users details, stage them, and once all are staged, submit them.</p>
				</div>
			</div>
			<div className="col w-full gap-4 overflow-hidden pb-4">
				<UserForm onStageUser={user => setStagedUsers(users => [user, ...users])} />
				<div className="w-full overflow-hidden border border-black/30 bg-black/20 p-4">
					<div className="h-full w-full overflow-y-scroll">
						<div className="col items-center gap-2">
							{stagedUsers.length === 0 ?
								<SubTitle>No Users staged yet.</SubTitle>
							:	stagedUsers.map((user, index) => (
									<StagedUserTile
										key={user.username}
										user={user}
										isUserEditing={currentUserBeingEdited === index}
										onSaveUser={newUser =>
											setStagedUsers(currentStagedUsers =>
												currentStagedUsers.map(currentUser => {
													if (index === currentUserBeingEdited) {
														setCurrentUserBeingEdited(undefined);
														return newUser;
													}
													return currentUser;
												}),
											)
										}
										onStartEditUser={() => setCurrentUserBeingEdited(index)}
										onDeleteUser={() =>
											setStagedUsers(users => users.filter((_, userIndex) => index !== userIndex))
										}
									/>
								))
							}
						</div>
					</div>
				</div>
				{stagedUsers.length !== 0 ?
					<Button palette="blackOnWhite" disabled={submitPending} onClick={() => void submitUsers()}>
						Submit Staged Users
					</Button>
				:	null}
			</div>
		</div>
	);
};

export default Page;
