import { FastifyInstance, FastifyRequest } from 'fastify';
import { verifyKey } from 'discord-interactions';
import { APIInteraction, APIInteractionResponse } from 'discord-api-types/v9';

import { Config } from '../../Utilities/Config';
import { Handlers } from '../../Interactions/Handlers';

const validateInteraction = (req: FastifyRequest) => {
	const signature = req.headers['x-signature-ed25519'] as string;
	const timestamp = req.headers['x-signature-timestamp'] as string;

	if (
		!req.rawBody
		|| !signature
		|| !timestamp
		|| parseInt(timestamp) < (Date.now() - Config.MAX_TIMEOUT) / 1000
	)
		return false;

	return verifyKey(
		req.rawBody,
		signature,
		timestamp,
		Config.PUBLIC_KEY
	);
};

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post<{
		Body: APIInteraction,
		Reply: APIInteractionResponse | string
	}>('/interaction', {
		preValidation: (req, res, done) => {
			const valid = validateInteraction(req);
			if (!valid)
				return res.code(401).send('Invalid signature');

			return done();
		}
	}, async (req, res) => {
		const interaction = req.body;
		const result = await Handlers.HandleInteraction(interaction);
		return res.send(result);
	});
};