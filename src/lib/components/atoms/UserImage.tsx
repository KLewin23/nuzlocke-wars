import Image from 'next/image';
import type { UserData } from '@/type/queries';
import QuestionMark from '@/public/QuestionMark.svg';

interface Props {
	userData?: UserData;
}

const UserImage = ({ userData }: Props) => (
	<div className="border-gradient-gold h-21 w-21 3xl:h-25 3xl:w-25 border-2">
		{userData?.image ?
			<Image
				unoptimized
				src={userData?.image}
				loading="eager"
				alt="Profile image for drafted player"
				className="h-full w-full object-cover"
				height={84}
				width={84}
			/>
		:	<div className="bg-black/20 p-4">
				<Image src={QuestionMark as string} loading="eager" alt="Image for unknown user" />
			</div>
		}
	</div>
);

export default UserImage;
