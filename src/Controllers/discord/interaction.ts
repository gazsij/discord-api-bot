import { FastifyInstance } from 'fastify';
import { InteractionType, APIInteraction, InteractionResponseType, APIInteractionResponse } from 'discord-api-types/v9';
import { verifyKey } from 'discord-interactions';

import { Config } from '../../Utilities/Config';

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post<{
		Body: APIInteraction,
		Reply: APIInteractionResponse | string
	}>('/interaction', {
		preValidation: (request, reply, done) => {
			if (!request.rawBody)
				return reply.code(401).send('Bad request.');

			const signature = request.headers['x-signature-ed25519'] as string;
			const timestamp = request.headers['x-signature-timestamp'] as string;

			const isValidRequest = verifyKey(
				request.rawBody,
				signature,
				timestamp,
				Config.PUBLIC_KEY as string
			);

			if (!isValidRequest)
				return reply.code(401).send('Bad request signature.');

			return done();
		}
	}, async (request, reply) => {
		if (request.body.type === InteractionType.Ping)
			return reply.send({ type: InteractionResponseType.Pong });

		throw 'Unknown Type';
	});
};