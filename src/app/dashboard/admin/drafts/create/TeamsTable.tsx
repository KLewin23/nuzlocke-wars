import { Controller } from 'react-hook-form';
import type { CreateDraftForm, RHFControl, User } from '@/type/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';

import TeamsActionsContextMenu from './DeletionContextMenu';

interface Props {
	control: RHFControl<CreateDraftForm>;
	users: Array<User>;
}

const TeamsTable = ({ control, users }: Props) => (
	<Controller
		name="teams"
		control={control}
		render={({ field }) => (
			<>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>State</TableHead>
							<TableHead>Captain</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{field.value.length === 0 ?
							<TableRow>
								<TableCell colSpan={4}>
									<p className="font-white min-h-40 font-sans text-lg leading-50">
										No teams selected.
									</p>
								</TableCell>
							</TableRow>
						:	field.value.map(team => (
								<TableRow key={team.name}>
									<TableCell>{team.name}</TableCell>
									<TableCell className="capitalize">{'id' in team ? 'Existing' : 'New'}</TableCell>
									<TableCell className="row justify-center items-center">
										<Select
											value={team.captain?.username}
											onValueChange={username =>
												field.onChange(
													field.value.map(t => ({
														...t,
														captain:
															t.name === team.name ?
																(users.find(u => u.username === username) ?? t)
															:	t,
													})),
												)
											}
										>
											<SelectTrigger className="row max-w-50 text-center cursor-pointer">
												<SelectValue placeholder={team.captain.username} />
											</SelectTrigger>
											<SelectContent>
												<SelectGroup>
													{users.map(user => (
														<SelectItem key={user.id} value={user.username}>
															{user.username}
														</SelectItem>
													))}
												</SelectGroup>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell>
										<TeamsActionsContextMenu
											onDelete={() =>
												field.onChange(field.value.filter(t => t.name === team.name))
											}
										/>
									</TableCell>
								</TableRow>
							))
						}
					</TableBody>
				</Table>
			</>
		)}
	/>
);

export default TeamsTable;
