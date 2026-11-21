'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { useTRPC } from '@/trpc/client';
import TwitchIcon from '@/public/twitchIcon.svg';
import { useQuery } from '@tanstack/react-query';
import SubTitle from '@/components/atoms/typography/SubTitle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/atoms/tooltip';

const ClipsTable = () => {
	const trpc = useTRPC();
	const clipsResponse = useQuery(trpc.getClips.queryOptions({ cursor: 0, pageSize: 20 }));

	return (
		<div className="col w-full items-center gap-4">
			<h2 className="xs:text-5xl font-railroad-gothic text-xl sm:text-4xl md:text-6xl">Highlights</h2>
			{clipsResponse.isError ?
				<SubTitle>Failed to retrieve our highlights :{'('}</SubTitle>
			:	<div className="auto-rows px-gutters grid w-full grid-flow-row grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-4 place-items-center">
					{clipsResponse.data?.map(clip => (
						<div key={`clip-${clip.id}`} className="col bg-clip w-fit gap-2 rounded-2xl p-4">
							<Link href={clip.url}>
								<div className="overflow-hidden rounded-2xl">
									<Image
										alt={`Clip thumbnail title: ${clip.title}`}
										src={clip.thumbnailUrl}
										unoptimized
										height={300}
										width={400}
									/>
								</div>
							</Link>
							<div className="col gap-1">
								<p className="text-lg font-bold">{clip.title}</p>
								<Link href={`https://twitch.tv/${clip.broadcasterName}`}>
									<div className="row items-center gap-2">
										<Image alt="Twitch Logo" src={TwitchIcon as string} height={22} width={22} />
										<p className="text-lg">{clip.broadcasterName}</p>
									</div>
								</Link>
								<Tooltip>
									<TooltipTrigger>
										<div className="row items-center gap-2">
											<Pencil size={22} />
											<p> {clip.creatorName}</p>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Clip created by {clip.creatorName}.</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					))}
				</div>
			}
		</div>
	);
};

export default ClipsTable;
