import type { CountdownRenderProps } from 'react-countdown';

interface Props {
	completedMessage?: string;
}

const CountdownRenderer = ({ seconds, minutes, completed, completedMessage }: CountdownRenderProps & Props) =>
	completed && completedMessage !== undefined ?
		<div className="bg-destructive p-2">
			<p className="font-railroad-gothic text-lg">{completedMessage}</p>
		</div>
	:	<p className="font-railroad-gothic text-lg">
			{minutes}:{seconds.toString().padStart(2, '0')}
		</p>;

export default CountdownRenderer;
