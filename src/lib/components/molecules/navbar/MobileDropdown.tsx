import Button from '@atoms/Button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@atoms/dropdownMenu';

const MobileDropdown = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="col cursor-pointer gap-1">
					<div className="bg-foreground h-1 w-5 rounded" />
					<div className="bg-foreground h-1 w-5 rounded" />
					<div className="bg-foreground h-1 w-5 rounded" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="bg-background">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic cursor-pointer text-xl font-bold">HOME</p>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic cursor-pointer text-xl font-bold">WARRIORS</p>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic cursor-pointer text-xl font-bold">HIGHLIGHTS</p>
						</a>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href="/">
							<p className="font-railroad-gothic cursor-pointer text-xl font-bold">FAQ</p>
						</a>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default MobileDropdown;
