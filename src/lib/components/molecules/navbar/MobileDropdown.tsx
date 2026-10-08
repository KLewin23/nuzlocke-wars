import React from 'react';
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@atoms';

const MobileDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="col cursor-pointer gap-1">
					<div className="h-1 w-5 rounded bg-foreground" />
					<div className="h-1 w-5 rounded bg-foreground" />
					<div className="h-1 w-5 rounded bg-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-background">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold cursor-pointer">HOME</p>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold cursor-pointer">WARRIORS</p>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold cursor-pointer">HIGHLIGHTS</p>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold cursor-pointer">FAQ</p>
						</a>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MobileDropdown;
