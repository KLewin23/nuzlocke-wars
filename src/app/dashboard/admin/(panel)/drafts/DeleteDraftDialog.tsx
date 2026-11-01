'use client';

import Button from '@/atoms/Button';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import createActionHandler from '@/util/actions';
import deleteDraft from '@/actions/draft/deleteDraft';
import { InputField } from '@/components/molecules/field';
import { DialogContent, DialogHeader, DialogTitle } from '@/atoms/dialog';

interface FormValues {
	draftName: string;
}

interface Props {
	draftId: number;
	targetDraftName: string;
	onClose: () => void;
}

const DeleteDraftDialog = ({ draftId, targetDraftName, onClose }: Props) => {
	const [isPending, startTransition] = useTransition();
	const handleAction = createActionHandler(startTransition);
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			draftName: '',
		},
	});

	const deleteUser = (valyues: FormValues) =>
		startTransition(() =>
			handleAction(deleteDraft(draftId), () => {
				onClose();
				return {
					title: 'Draft Deleted',
					description: `Draft \`${valyues.draftName}\` has been deleted.`,
				};
			}),
		);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete Draft</DialogTitle>
			</DialogHeader>
			<p>
				Proceeding will delete:&nbsp;
				<span className="rounded bg-black/20 px-2 py-1 font-bold">{targetDraftName}</span>
			</p>
			<form className="col w-full gap-4" onSubmit={e => void handleSubmit(deleteUser)(e)}>
				<InputField
					name="draftName"
					control={control}
					showError
					label="Enter the draft's name to proceed."
					placeholder="Enter draft name to be deleted."
					rules={{
						required: 'You must match the target draft name to proceed',
						validate: dName =>
							dName === targetDraftName ? true : "Validation draft name must match target draft's name",
					}}
				/>
				<Button palette="destructive" disabled={isPending}>
					Delete Draft
				</Button>
			</form>
		</DialogContent>
	);
};

export default DeleteDraftDialog;
