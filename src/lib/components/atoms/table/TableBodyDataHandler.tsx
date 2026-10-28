import type { ReactNode } from 'react';
import type { Either } from '@/util/either';
import { TableCell, TableRow } from '@/atoms/table';
import type { QueryFailureState, Success } from '@/util/query';

import { ErrorFallback } from '../ErrorFallback';

interface Props<D> {
	columnCount: number
	noDataMessage?: string;
	errorMessage?: string;
	dataResponse: Either<QueryFailureState, Success<Array<D>>>;
	children: (data: D) => ReactNode;
}

const TableBodyDataHandler = <Data,>({
	columnCount,
	noDataMessage = 'No data to display',
	errorMessage = 'Something went wrong retrieving data',
	dataResponse,
	children,
}: Props<Data>) =>
	dataResponse._type === 'right' ?
		dataResponse.value.data.length === 0 ?
			<TableRow>
				<TableCell colSpan={columnCount}>
					<p className="font-white min-h-80 font-sans text-lg leading-70">{noDataMessage}</p>
				</TableCell>
			</TableRow>
		:	dataResponse.value.data.map(children)
	:	<TableRow >
			<TableCell colSpan={columnCount}>
				<ErrorFallback message={errorMessage} className="min-h-80 leading-70" />
			</TableCell>
		</TableRow>;

export { TableBodyDataHandler };
