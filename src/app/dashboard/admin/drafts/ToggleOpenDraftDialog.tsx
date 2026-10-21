'use client';

import { toast } from 'sonner';
import Button from '@/atoms/Button';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import openDraft from '@/actions/draft/openDraft';
import { failureAsTransition } from '@/util/query';
import closeDraft from '@/actions/draft/closeDraft';
import { InputField } from '@/components/molecules/field';
import { DialogContent, DialogHeader, DialogTitle } from '@/atoms/dialog';

interface Props {
	mode: 'openDraft' | 'closeDraft';
	draftId: number;
	targetDraftName: string;
	onClose: () => void;
}

const ToggleOpenDraftDialog = ({ mode, draftId, targetDraftName, onClose }: Props) => {
	const router = useRouter();
	const [submitPending, startSubmitTransition] = useTransition();
	const { control, handleSubmit } = useForm<{ draftName: string }>({
		defaultValues: {
			draftName: '',
		},
	});

	const action = mode === 'openDraft' ? 'open' : 'close';
	const capitalAction = mode === 'openDraft' ? 'Open' : 'Close';

	const toggleDraftTransition = (draftId: number) =>
		startSubmitTransition(async () => {
			const response = mode === 'openDraft' ? await openDraft(draftId) : await closeDraft(draftId);
			// console.log(response)
			if (response._type === 'left') return failureAsTransition(response.value, startSubmitTransition);
			return startSubmitTransition(() => {
				onClose();
				toast(`Draft ${mode === 'openDraft' ? 'Opened' : 'Closed'}`, {
					description: `Draft successfully  ${action}ed.`,
				});
				router.refresh();
			});
		});

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{capitalAction} Draft</DialogTitle>
			</DialogHeader>
			<p>
				Proceeding will ${action} the draft:&nbsp;
				<span className="rounded bg-black/20 px-2 py-1 font-bold">{targetDraftName}</span> <br />
				Warning: Players will be able to join the draft once ${action}
			</p>
			<form
				className="col w-full gap-4"
				onSubmit={e => void handleSubmit(() => toggleDraftTransition(draftId))(e)}
			>
				<InputField
					name="draftName"
					control={control}
					showError
					label="Enter the drafts's name to proceed."
					placeholder={`Enter name of to be ${action}ed.`}
					rules={{
						required: "You must match the target draft's name to proceed",
						validate: uname =>
							uname === targetDraftName ? true : "Validation draft name must match target drafts's name",
					}}
				/>
				<Button palette={mode === 'openDraft' ? 'green' : 'destructive'} disabled={submitPending}>
					{capitalAction} Draft
				</Button>
			</form>
		</DialogContent>
	);
};

export default ToggleOpenDraftDialog;
