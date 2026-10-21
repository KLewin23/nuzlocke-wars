import cn from 'cnfast';
import React from 'react';
import { SearchIcon } from 'lucide-react';
import { Command as CommandPrimitive } from 'cmdk';
import InputGroup from '@/atoms/inputGroup/InputGroup';
import InputGroupAddon from '@/atoms/inputGroup/InputGroupAddon';

const CommandInput = ({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) => (
	<div data-slot="command-input-wrapper" className="p-1 pb-0">
		<InputGroup className="border-black/30 bg-input/30 h-8! shadow-none! rounded-none *:data-[slot=input-group-addon]:pl-2!">
			<CommandPrimitive.Input
				data-slot="command-input"
				className={cn(
					'w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				{...props}
			/>
			<InputGroupAddon>
				<SearchIcon className="size-4 shrink-0 opacity-50" />
			</InputGroupAddon>
		</InputGroup>
	</div>
);

export { CommandInput };
