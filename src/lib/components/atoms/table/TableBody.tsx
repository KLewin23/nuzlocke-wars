'use client';

import { cn } from 'cnfast';

const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => (
	<tbody data-slot="table-body" className={cn('border-x border-black/30 bg-black/10', className)} {...props} />
);

export { TableBody };
