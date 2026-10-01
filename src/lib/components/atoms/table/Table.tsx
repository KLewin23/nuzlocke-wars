'use client';

import { cn } from 'cnfast';

const Table = ({ className, ...props }: React.ComponentProps<'table'>) => (
	<div data-slot="table-container" className="relative w-full overflow-x-auto">
		<table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
	</div>
);

export { Table };
