import { MinusIcon } from 'lucide-react';

const InputOTPSeparator = ({ ...props }: React.ComponentProps<'div'>) => (
	<div
		data-slot="input-otp-separator"
		className="flex items-center [&_svg:not([class*='size-'])]:size-4"
		role="separator"
		{...props}
	>
		<MinusIcon />
	</div>
);

export { InputOTPSeparator };
