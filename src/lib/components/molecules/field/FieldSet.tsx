import cn from 'cnfast';
import React, { type JSX } from 'react';

const FieldSet = ({ className, ...props }: React.ComponentProps<'fieldset'>): JSX.Element => (
	<fieldset
		data-slot="field-set"
		className={cn(
			'flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
			className,
		)}
		{...props}
	/>
);

export { FieldSet };
