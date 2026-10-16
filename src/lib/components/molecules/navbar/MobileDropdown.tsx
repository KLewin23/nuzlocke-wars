import Button from '@/atoms/Button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/atoms/dropdownMenu';
import Link from 'next/link';

const MobileDropdown = () => (
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
					<Link href="/">
						<p className="font-railroad-gothic cursor-pointer text-xl font-bold">HOME</p>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/">
						<p className="font-railroad-gothic cursor-pointer text-xl font-bold">WARRIORS</p>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/">
						<p className="font-railroad-gothic cursor-pointer text-xl font-bold">HIGHLIGHTS</p>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/">
						<p className="font-railroad-gothic cursor-pointer text-xl font-bold">FAQ</p>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
);

export default MobileDropdown;
