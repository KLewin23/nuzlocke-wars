import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => (
	<div className="col gradient-radial-blue h-screen w-full items-center">{children}</div>
);

export default layout;
