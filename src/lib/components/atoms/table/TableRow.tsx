'use client';

import { cn } from 'cnfast';

const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => (
	<tr
		data-slot="table-row"
		className={cn(
			'hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted border-b border-black/30 transition-colors',
			className,
		)}
		{...props}
	/>
);

export { TableRow };
