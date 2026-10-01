import React from 'react';
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
							<TableHead>Username</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Session Count</TableHead>
							<TableHead>Creation Date</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Kieran</TableCell>
							<TableCell>Role</TableCell>
							<TableCell>Session Count</TableCell>
							<TableCell>Creation Date</TableCell>
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
