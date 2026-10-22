import { type Either } from '@/util/either';
import withSession from '@/func/withSession';
import { GetCurrentCaptainSpend } from '@/type/queries';
import { type QueryFailureState, type Success } from '@/util/query';

import noAuthCaptainSpend from '../noAuthCaptainSpend';

const getCurrentCaptainSpend = async (): Promise<Either<QueryFailureState, Success<GetCurrentCaptainSpend>>> =>
	withSession(async session => noAuthCaptainSpend(session));

export default getCurrentCaptainSpend;
