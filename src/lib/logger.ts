import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export default pino({
	level: isProduction ? 'info' : 'debug',
	
	...(isProduction ?
		{}
	:	{
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
				},
			},
		}),
});
