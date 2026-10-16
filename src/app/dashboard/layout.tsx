import type { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => (
	<div className="col gradient-radial-blue h-screen max-h-screen w-full items-center overflow-hidden">{children}</div>
);

export default layout;
