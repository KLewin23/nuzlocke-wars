'use client';

import { cn } from 'cnfast';

const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => (
	<thead data-slot="table-header" className={cn('[&_tr]:border border border-black/30 bg-black/20', className)} {...props} />
);

export { TableHeader };
