import type { ReactNode } from 'react';
import type { Either } from '@/util/either';
import { TableCell, TableRow } from '@/atoms/table';
import type { QueryFailureState, Success } from '@/util/query';

import { ErrorFallback } from '../ErrorFallback';

interface Props<D> {
	noDataMessage?: string;
	errorMessage?: string;
	dataResponse: Either<QueryFailureState, Success<Array<D>>>;
	children: (data: D) => ReactNode;
}

const TableBodyDataHandler = <Data,>({
	noDataMessage = 'No data to display',
	errorMessage = 'Something went wrong retrieving data',
	dataResponse,
	children,
}: Props<Data>) =>
	dataResponse._type === 'right' ?
		dataResponse.value.data.length === 0 ?
			<TableRow>
				<TableCell colSpan={4}>
					<p className="font-white min-h-80 font-sans text-lg leading-70">{noDataMessage}</p>
				</TableCell>
			</TableRow>
		:	dataResponse.value.data.map(children)
	:	<TableRow>
			<TableCell colSpan={4}>
				<ErrorFallback message={errorMessage} className="min-h-80 leading-70" />
			</TableCell>
		</TableRow>;

export { TableBodyDataHandler };
