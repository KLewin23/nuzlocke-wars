'use client';

import { cn } from 'cnfast';
import Button from '@/atoms/Button';
import { useMemo, useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/atoms/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/molecules/command';

interface Props {
	selectedTeamName: string;
	existingTeams: Array<string>;
	onChange: (selectedName: string) => void;
}

const TeamNameCombobox = ({ selectedTeamName, onChange, existingTeams }: Props) => {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');
	const isExisting = useMemo(
		() => existingTeams.some(t => t === selectedTeamName),
		[existingTeams, selectedTeamName],
	);

	const onValueChange = (value: string) => {
		onChange(value);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					role="combobox"
					aria-expanded={open}
					className="w-ful justify-between border border-black/30 bg-black/20"
				>
					{selectedTeamName ? selectedTeamName : "Select or type team's name..."}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 p-0">
				<Command>
					<CommandInput
						placeholder="Search or add teams..."
						value={searchValue}
						onValueChange={setSearchValue}
					/>
					<CommandList>
						<CommandEmpty
							className={cn('mt-1', searchValue !== '' ? 'cursor-pointer hover:bg-black/10' : '')}
						>
							{searchValue !== '' ?
								<button className="cursor-pointer" onClick={() => onValueChange(searchValue)}>
									Create Team: {searchValue}
								</button>
							:	<p>Search or create a team </p>}
						</CommandEmpty>
						<CommandGroup>
							{isExisting ?
								existingTeams.map(team => (
									<CommandItem
										key={team}
										value={team} 
										className='cursor-pointer hover:bg-black/10'
										onSelect={() => onValueChange(team)}
									>
										<CheckIcon
											className={cn(
												'mr-2 h-4 w-4',
												selectedTeamName === team ? 'opacity-100' : 'opacity-0',
											)}
										/>
										{team}
									</CommandItem>
								))
							: selectedTeamName !== '' || searchValue !== '' ?
								<CommandItem
									key={selectedTeamName}
									value={selectedTeamName}
									className='cursor-pointer hover:bg-black/10'
									onSelect={() => onValueChange(selectedTeamName)}
								>
									<CheckIcon className={cn('mr-2 h-4 w-4', 'opacity-100')} />
									{selectedTeamName}
								</CommandItem>
							:	null}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default TeamNameCombobox;
