import cn from 'cnfast';
import type { JSX } from 'react/jsx-runtime';

const Title = ({ children, className, ...props }: JSX.IntrinsicElements['h1']) => (
	<h2 className={cn('xs:text-5xl text-xl sm:text-4xl md:text-3xl font-railroad-gothic', className)} {...props}>
		{children}
	</h2>
);

export default Title;
