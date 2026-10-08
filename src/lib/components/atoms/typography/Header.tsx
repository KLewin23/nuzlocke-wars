import cn from 'cnfast';
import { JSX } from 'react/jsx-runtime';

interface Props {
	children: string;
}

const Header = ({ children, className, ...props }: JSX.IntrinsicElements['h1']) => (
	<h1 className={cn('text-2xl xs:text-5xl sm:text-7xl md:text-9xl', className)} {...props}>
		{children}
	</h1>
);

export { Header };
