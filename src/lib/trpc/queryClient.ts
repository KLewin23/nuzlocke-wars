import superjson from 'superjson';
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

const makeQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 30 * 1000,
			},
			dehydrate: {
				serializeData: superjson.serialize,
				shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
			},
			hydrate: {
				deserializeData: superjson.deserialize,
			},
		},
	});

export default makeQueryClient;
