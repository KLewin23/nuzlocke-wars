import { NextResponse } from 'next/server';

const routeErrorResponse = (message: string, code: number) =>
	NextResponse.json(
		{
			errorMessage: message,
		},
		{
			status: code,
			headers: new Headers({
				'content-type': 'application/json',
			}),
		},
	);

export default routeErrorResponse;
