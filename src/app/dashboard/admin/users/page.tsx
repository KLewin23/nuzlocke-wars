import Link from 'next/link';
import Button from '@/atoms/Button';
import getUsers from '@/func/serverFunctions/getUsers';
import UserActionsContextMenu from './UserActionsContextMenu';
import { Table, TableBody, TableBodyDataHandler, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/table';

const page = async () => {
	const users = await getUsers();

	return (
		<div className="col w-full max-w-250 grow items-end gap-4 self-center">
			<Link href="/dashboard/admin/users/create">
				<Button palette="blackOnWhite">Create User</Button>
			</Link>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Username</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Session Count</TableHead>
						<TableHead>Creation Date</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableBodyDataHandler noDataMessage="No users to display" dataResponse={users}>
						{user => (
							<TableRow key={user.id}>
								<TableCell>{user.username}</TableCell>
								<TableCell className="capitalize">{user.role}</TableCell>
								<TableCell>{user.userSessionsCount}</TableCell>
								<TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
								<TableCell>
									<UserActionsContextMenu user={user} />
								</TableCell>
							</TableRow>
						)}
					</TableBodyDataHandler>
				</TableBody>
			</Table>
		</div>
	);
};

export default page;
