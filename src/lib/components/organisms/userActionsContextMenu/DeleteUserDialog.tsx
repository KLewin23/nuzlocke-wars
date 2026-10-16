import Input from '@atoms/Input';
import Button from '@atoms/Button';
import { DialogContent, DialogHeader, DialogTitle } from '@atoms/dialog';

interface Props {
	targetUsername: string;
}

const DeleteUserDialog = ({ targetUsername }: Props) => (
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Delete User</DialogTitle>
		</DialogHeader>
		<p>
			Proceeding will delete:&nbsp;
			<span className="rounded bg-black/20 px-2 py-1 font-bold">{targetUsername}</span>
		</p>
		<div className="col font-bold">
			<p>Enter the user&apos;s username to proceed.</p>
			<Input placeholder="Enter username to be deleted." />
		</div>
		<Button palette="destructive">Delete User</Button>
	</DialogContent>
);

export default DeleteUserDialog;
