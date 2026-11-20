import React from 'react';
import type { Either } from '@/util/either';
import type { BareTwitchClip } from '@/type/twitch';
import type { QueryFailureState, Success } from '@/util/query';
import { Table, TableBody, TableBodyDataHandler, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/table';

interface Props {
	getClipResponse: Either<QueryFailureState, Success<Array<BareTwitchClip>>>;
}

const ClipTable = ({ getClipResponse }: Props) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Title</TableHead>
				<TableHead>Status</TableHead>
				<TableHead>Creator Name</TableHead>
				<TableHead>Streamer Name</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableBodyDataHandler columnCount={4} noDataMessage="No clips to display" dataResponse={getClipResponse}>
				{clip => (
					<TableRow key={`clip-row-${clip.id}`}>
						<TableCell>{clip.title}</TableCell>
						<TableCell>{clip.status}</TableCell>
						<TableCell>{clip.creatorName}</TableCell>
						<TableCell>{clip.broadcasterName}</TableCell>
					</TableRow>
				)}
			</TableBodyDataHandler>
		</TableBody>
	</Table>
);

export default ClipTable;
