import Link from 'next/link';
import Button from '@/atoms/Button';
import getDrafts from '@/func/draft/authenticated/getDrafts';
import { Table, TableBody, TableBodyDataHandler, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/table';

import DraftActionsContextMenu from './DraftActionsContextMenu';

const page = async () => {
	const drafts = await getDrafts();

	return (
		<div className="col w-full max-w-250 grow items-end gap-4 self-center">
			<Link href="/dashboard/admin/drafts/create">
				<Button palette="blackOnWhite">Create Draft</Button>
			</Link>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Draft Name</TableHead>
						<TableHead>Max Capacity</TableHead>
						<TableHead>State</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableBodyDataHandler noDataMessage="No drafts to display" dataResponse={drafts}>
						{draft => (
							<TableRow key={`draft-row-${draft.id}`}>
								<TableCell>{draft.name}</TableCell>
								<TableCell>{draft.playerCount}</TableCell>
								<TableCell className="capitalize">{draft.status}</TableCell>
								<TableCell>
									<DraftActionsContextMenu draft={draft} />
								</TableCell>
							</TableRow>
						)}
					</TableBodyDataHandler>
				</TableBody>
			</Table>
		</div>
	);
};

export default page;
