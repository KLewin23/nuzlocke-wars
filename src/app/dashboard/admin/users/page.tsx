import Button from '@atoms/Button';
import { db, session, user } from '@db';
import { eitherOr } from '@type/either';
import { count, eq } from 'drizzle-orm';
import { EllipsisVertical } from 'lucide-react';
import { ErrorFallback } from '@atoms/ErrorFallback';
import { DashboardNavbar } from '@organisms/DashboardNavbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@atoms/table';

const page = async () => {
	const users = await eitherOr(
		db
			.select({
				id: user.id,
				username: user.username,
				role: user.role,
				createdAt: user.createdAt,
				userSessionsCount: count(session.id),
			})
			.from(user)
			.leftJoin(session, eq(user.id, session.userId))
			.groupBy(user.id),
		e => {
			console.error(e);
			return 'Failed to retrieve users.';
		},
	);

	return (
		<div className="col w-full gap-16">
			<DashboardNavbar />
			<div className="col w-full max-w-250 grow items-end gap-4 self-center">
				<Button palette="blackOnWhite">Create User</Button>
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
						{users._type === 'right' ?
							users.value.map(user => (
								<TableRow key={user.id}>
									<TableCell>{user.username}</TableCell>
									<TableCell className="capitalize">{user.role}</TableCell>
									<TableCell>{user.userSessionsCount}</TableCell>
									<TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
									<TableCell>
										<Button variant="ghost">
											<EllipsisVertical />
										</Button>
									</TableCell>
								</TableRow>
							))
						:	<TableRow>
								<TableCell colSpan={5}>
									<ErrorFallback message={users.value} className="min-h-80 leading-70" />
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default page;
