'use client';

import { cn } from 'cnfast';

const Table = ({ className, ...props }: React.ComponentProps<'table'>) => (
	<div data-slot="table-container" className="relative w-full max-h-full overflow-auto border-x border-t border-black/30">
		<table data-slot="table" className={cn('w-full caption-bottom text-sm border-collapse', className)} {...props} />
	</div>
);

export { Table };
