import Button from '@atoms/Button';
import { EllipsisVertical } from 'lucide-react';
import getDrafts from '@/actions/draft/getDrafts';
import DashboardNavbar from '@organisms/DashboardNavbar';
import { Table, TableBody, TableBodyDataHandler, TableCell, TableHead, TableHeader, TableRow } from '@atoms/table';

const page = async () => {
	const drafts = await getDrafts();

	return (
		<div className="col w-full gap-16">
			<DashboardNavbar />
			<div className="col w-full max-w-250 grow items-end gap-4 self-center">
				<Button palette="blackOnWhite">CREATE DRAFT</Button>
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
										<Button variant="ghost">
											<EllipsisVertical />
										</Button>
									</TableCell>
								</TableRow>
							)}
						</TableBodyDataHandler>
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default page;
