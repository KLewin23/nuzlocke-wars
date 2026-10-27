import type { ReactNode } from 'react';

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => (
	<div className="col h-screen max-h-screen w-full gap-8 overflow-hidden">{children}</div>
);

export default layout;
