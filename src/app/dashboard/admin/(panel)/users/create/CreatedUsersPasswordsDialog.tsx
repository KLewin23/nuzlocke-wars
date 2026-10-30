'use client';

import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import Button from '@/components/atoms/Button';
import type { CreatedUser } from '@/type/queries';
import { stringify } from 'csv-stringify/browser/esm/sync';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/atoms/dialog';

interface Props {
	users: Array<CreatedUser> | undefined;
	onClose: () => void;
}

const CreatedUsersPasswordsDialog = ({ onClose, users }: Props) => (
	<Dialog
		open={users !== undefined}
		onOpenChange={c => {
			if (c === false) return onClose();
		}}
	>
		<DialogContent>
			<div className="col max-h-150 gap-4 overflow-hidden pb-4">
				<DialogHeader>
					<DialogTitle>Created User Data</DialogTitle>
					<DialogDescription>
						Account details for the created user. This is irretrievable once closed.
					</DialogDescription>
				</DialogHeader>
				<div className="col gap-4 overflow-hidden">
					<Button
						palette="blackOnWhite"
						onClick={() => {
							void navigator.clipboard.writeText(stringify(users ?? [], { header: true }));
							toast.success('User data successfully', {
								description: 'User data was copied as a CSV successfully.',
							});
						}}
					>
						<Copy color="#000000" strokeWidth={3} />
						Copy Users (CSV)
					</Button>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Username</TableHead>
								<TableHead>Password</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{users?.map(user => (
								<TableRow key={user.username}>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.password}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</DialogContent>
	</Dialog>
);

export default CreatedUsersPasswordsDialog;
