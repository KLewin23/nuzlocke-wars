import cn from 'cnfast';
import type { JSX } from 'react/jsx-runtime';

const SubTitle = ({ children, className, ...props }: JSX.IntrinsicElements['h1']) => (
	<h3 className={cn('xs:text-2xl text-md sm:text-2xl md:text-1xl font-railroad-gothic', className)} {...props}>
		{children}
	</h3>
);

export default SubTitle;
