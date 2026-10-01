import { DashboardNavbar } from '@organisms';
import { EllipsisVertical } from 'lucide-react';
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@atoms';

const page = () => {
	return (
		<div className="col w-full gap-16">
			<DashboardNavbar />
			<div className="col w-full max-w-250 grow items-end gap-4 self-center">
				<Button palette="blackOnWhite">CREATE DRAFT</Button>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Draft Name</TableHead>
							<TableHead>Current Player Count</TableHead>
							<TableHead>Max Capacity</TableHead>
							<TableHead>State</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>INV001</TableCell>
							<TableCell>Paid</TableCell>
							<TableCell>Credit Card</TableCell>
							<TableCell>$250.00</TableCell>
							<TableCell>
								<Button variant="ghost">
									<EllipsisVertical />
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default page;
