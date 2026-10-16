import cn from 'cnfast';

const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => (
	<div data-slot="dialog-header" className={cn('flex flex-col gap-2', className)} {...props} />
);

export { DialogHeader };
