import z from 'zod';
import Link from 'next/link';
import { DraftStatus } from '@/db';
import Button from '@/atoms/Button';
import Title from '@/components/atoms/typography/Title';
import DashboardNavbar from '@/organisms/DashboardNavbar';
import ErrorToaster from '@/components/atoms/ErrorToaster';
import getDrafts from '@/func/serverFunctions/getDrafts';
import SubTitle from '@/components/atoms/typography/SubTitle';
import { type QueryFailureState, readableFromFailureType, readableQueryFailure } from '@/util/query';

const queryParamSchema = z.toZod<{
	type: QueryFailureState['type'];
}>()(
	z.object({
		type: z.union([
			z.literal('Forbidden'),
			z.literal('NotFound'),
			z.literal('Unauthorized'),
			z.literal('Rejected'),
			z.literal('BadRequest'),
			z.literal('InternalServerError'),
		]),
	}),
);

const page = async ({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) => {
	const params = await searchParams;
	const drafts = await getDrafts();
	const error = queryParamSchema.safeParse(params);

	return (
		<div className="col h-screen max-h-screen w-full gap-8 overflow-hidden">
			<ErrorToaster
				error={
					error.success ?
						{ title: 'Error loading draft.', description: readableFromFailureType(error.data.type) }
					:	undefined
				}
			/>
			<DashboardNavbar />
			<div className="col w-full max-w-250 grow gap-4 self-center">
				<Title>Your Drafts</Title>
				<div className="grid w-full grid-flow-row auto-rows-40 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
					{drafts._type === 'left' ?
						<div className="col-span-full border border-black/30 bg-black/20">
							<SubTitle>
								Failed to retrieve drafts, error: {readableQueryFailure(drafts.value).description}
							</SubTitle>
						</div>
					:	drafts.value.data.map(draft => (
							<div className="col justify-between border border-black/30 bg-black/20 p-4" key={draft.id}>
								<SubTitle>{draft.name}</SubTitle>
								<div className="row w-full justify-between">
									<SubTitle>Status: {draft.status}</SubTitle>
									{draft.status !== DraftStatus.closed ?
										<Link href={`/dashboard/draft/${draft.id}`}>
											<Button palette="green">Join Draft</Button>
										</Link>
									:	null}
								</div>
							</div>
						))
					}
				</div>
			</div>
		</div>
	);
};

export default page;
