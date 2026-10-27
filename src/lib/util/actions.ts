import { toast } from 'sonner';
import type { TransitionFunction } from 'react';

import type { Either } from './either';
import { type QueryFailureState, type QueryNonFailureState, readableQueryFailure } from './query';

const handleAction =
	(transitionFn: (callback: TransitionFunction) => void) =>
	<L extends QueryFailureState, R extends QueryNonFailureState>(
		action: Promise<Either<L, R>>,
		onSuccess: (value: R) => { title: string; description: string },
	) =>
		transitionFn(async () => {
			const response = await action;
			if (response._type === 'left')
				return transitionFn(() => {
					const failure = readableQueryFailure(response.value);
					toast.error(failure.title, { description: failure.description });
				});
			const toastInfo = onSuccess(response.value);
			toast.success(toastInfo.title, { description: toastInfo.description });
		});

export default handleAction;
