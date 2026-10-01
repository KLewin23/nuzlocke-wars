import { auth } from '@auth';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export const proxy = async (req: NextRequest) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const { pathname } = req.nextUrl;

	if (!session) {
		if (pathname === '/dashboard/login') return NextResponse.next();
		return NextResponse.redirect(new URL('/dashboard/login', req.url));
	}

	const pathBase = session.user.role === 'super' || session.user.role === 'admin' ? '/dashboard/admin' : '/dashboard';

	if (pathname === '/dashboard/login')
		return NextResponse.redirect(new URL(`${pathBase}/drafts`, req.url));

	if (session.user.role === 'super' || session.user.role === 'admin') {
		if (pathname.startsWith('/dashboard/admin')) return NextResponse.next();
		if (pathname.startsWith('/dashboard'))
			return NextResponse.redirect(new URL(pathname.replace('/dashboard', '/dashboard/admin'), req.url));
		return NextResponse.next();
	}

	if (req.url.startsWith('/dashboard/admin'))
		return NextResponse.redirect(new URL(pathname.replace('/dashboard/admin', '/dashboard'), req.url));

	return NextResponse.next();
};

export const config = {
	matcher: ['/dashboard/:path*'],
};
