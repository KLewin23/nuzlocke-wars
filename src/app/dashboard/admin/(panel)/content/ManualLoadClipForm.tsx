'use client';

import { useTransition } from 'react';
import handleAction from '@/util/actions';
import { useForm } from 'react-hook-form';
import Button from '@/components/atoms/Button';
import toastErrorMesage from '@/util/formError';
import loadClip from '@/actions/content/loadClip';
import { FieldSet, InputField } from '@/components/molecules/field';

interface FormValues {
	url: string;
	title?: string;
}

const ManualLoadClipForm = () => {
	const [submitPending, startTransition] = useTransition();
	const runAction = handleAction(startTransition);
	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			url: '',
			title: '',
		},
	});

	const submitClip = (values: FormValues) =>
		runAction(loadClip(values.url, values.title === '' ? undefined : values.title), () => {
			reset();
			return {
				title: 'Clip Loaded',
				description: 'Your clip was parsed and loaded and will now be visable in the content page.',
			};
		});

	return (
		<>
			<form
				className="col w-full gap-4 border border-black/30 bg-black/20 px-2 py-4"
				onSubmit={e => void handleSubmit(submitClip, err => toastErrorMesage(['url', 'title'], err))(e)}
			>
				<FieldSet className="w-full flex-row" data-testid="new-user-form">
					<InputField
						name="url"
						control={control}
						label="Twitch URL"
						placeholder="Enter Twitch URL."
						rules={{
							required: { message: 'A twitch url is required.', value: true },
							validate: url =>
								!url.startsWith('https://www.twitch.tv/') ?
									'URL must be a valid twitch url starting with `https://www.twitch.tv/`'
								:	true,
						}}
					/>
					<InputField
						name="title"
						control={control}
						label="Title Override (leave blank for title shown on twitch"
						placeholder="Title Override."
						rules={{
							minLength: 1,
							maxLength: 128,
						}}
					/>
				</FieldSet>
				<Button palette="blackOnWhite" className="w-fit self-end px-4" disabled={submitPending}>
					Load clip
				</Button>
			</form>
		</>
	);
};

export default ManualLoadClipForm;
