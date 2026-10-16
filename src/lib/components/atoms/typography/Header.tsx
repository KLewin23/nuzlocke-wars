import cn from 'cnfast';
import type { JSX } from 'react/jsx-runtime';

const Header = ({ children, className, ...props }: JSX.IntrinsicElements['h1']) => (
	<h1 className={cn('xs:text-5xl text-2xl sm:text-7xl md:text-9xl', className)} {...props}>
		{children}
	</h1>
);

export default Header;
