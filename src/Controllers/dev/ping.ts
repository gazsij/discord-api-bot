import { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.get('/ping', {
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						ok: { type: 'boolean' },
						status: { type: 'number' },
						data: { type: 'boolean' }
					}
				}
			}
		}
	}, async () => {
		return {
			ok: true,
			status: 200,
			data: 'pong'
		};
	});
};