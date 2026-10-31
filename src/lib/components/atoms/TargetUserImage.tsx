import Image from 'next/image';
import type { TargetUser } from '@/type/queries';
import QuestionMark from '@/public/QuestionMark.svg';

interface Props {
	targetUser?: TargetUser;
	forceHide?: boolean;
}

const TargetUserImage = ({ targetUser, forceHide = false }: Props) => (
	<div className="col items-center gap-2">
		<div className="border-gradient-gold 3xl:h-65 3xl:w-65 h-45 w-45 border-2">
			{targetUser?.image && !forceHide ?
				<Image
					unoptimized
					src={targetUser?.image}
					loading="eager"
					height={260}
					width={260}
					alt="Current target users profile picture"
				/>
			:	<div className="bg-black/20 p-4">
					<Image
						src={QuestionMark as string}
						loading="eager"
						height={260}
						width={260}
						alt="Image for unknown target user"
					/>
				</div>
			}
		</div>
		<p className="font-railroad-gothic text-lg">{!forceHide ? targetUser?.username : null}</p>
	</div>
);

export default TargetUserImage;
