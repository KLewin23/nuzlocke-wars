import Button from '@atoms/Button';
import { count, eq } from 'drizzle-orm';
import { eitherOr } from '@/lib/type/either';
import { EllipsisVertical } from 'lucide-react';
import { ErrorFallback } from '@atoms/ErrorFallback';
import { db, draft, user, usersToDrafts } from '@db';
import { DashboardNavbar } from '@organisms/DashboardNavbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@atoms/table';

const page = async () => {
	const drafts = await eitherOr(
		db
			.select({
				id: draft.id,
				name: draft.name,
				status: draft.status,
				playerCount: count(usersToDrafts.userId),
			})
			.from(draft)
			.leftJoin(usersToDrafts, eq(draft.id, usersToDrafts.draftId))
			.groupBy(draft.id),
		e => {
			console.error(e);
			return 'Failed to fetch list of drafts.';
		},
	);

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
						{drafts._type === 'right' ?
							drafts.value.map(draft => (
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
							))
						:	<TableRow>
								<TableCell colSpan={4}>
									<ErrorFallback message={drafts.value} className="min-h-80 leading-70" />
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default page;
