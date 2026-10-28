'use client';

import { cn } from 'cnfast';

const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
	<thead
		data-slot="table-header"
		className={cn('sticky top-0 border-b border-black/30 bg-[#1c2432]', className)}
		{...props}
	/>
);

export { TableHeader };
