import { FastifyInstance } from 'fastify';
import { verifyKey } from 'discord-interactions';
import {
	InteractionType,
	APIInteraction,
	InteractionResponseType,
	APIInteractionResponse,
	ApplicationCommandType,
	APIChatInputApplicationCommandInteraction,
	APIContextMenuInteraction,
	ComponentType
} from 'discord-api-types/v9';

import { Config } from '../../Utilities/Config';
import { Handlers } from '../../Interactions/Handlers';

export default async (fastify: FastifyInstance): Promise<void> => {
	fastify.post<{
		Body: APIInteraction,
		Reply: APIInteractionResponse | string
	}>('/interaction', {
		preValidation: (req, res, done) => {
			const signature = req.headers['x-signature-ed25519'] as string;
			const timestamp = req.headers['x-signature-timestamp'] as string;

			if (
				!req.rawBody
				|| !signature
				|| !timestamp
				|| parseInt(timestamp) < (Date.now() - Config.MAX_TIMEOUT) / 1000
			)
				return res.code(401).send('Invalid signature');

			const isValidRequest = verifyKey(
				req.rawBody,
				signature,
				timestamp,
				Config.PUBLIC_KEY as string
			);

			if (!isValidRequest)
				return res.code(401).send('Invalid signature');

			return done();
		}
	}, async (req, res) => {
		const interaction = req.body;

		switch (interaction.type) {
			case InteractionType.Ping:
				return { type: InteractionResponseType.Pong };

			case InteractionType.ApplicationCommand: {
				switch (interaction.data.type) {
					case ApplicationCommandType.ChatInput: {
						const result = await Handlers.ExecuteCommand(interaction as APIChatInputApplicationCommandInteraction);
						return res.send(result);
					}

					case ApplicationCommandType.Message || ApplicationCommandType.User: {
						const result = await Handlers.ExecuteContextMenu(interaction as APIContextMenuInteraction);
						return res.send(result);
					}

					default:
						throw 'Unknown Type';
				}
			}

			case InteractionType.MessageComponent:
				switch (interaction.data.component_type) {
					case ComponentType.Button: {
						const result = await Handlers.ExecuteButton(interaction);
						return res.send(result);
					}

					case ComponentType.SelectMenu: {
						const result = await Handlers.ExecuteSelectMenu(interaction);
						return res.send(result);
					}

					default:
						throw 'Unknown Type';
				}

			case InteractionType.ApplicationCommandAutocomplete: {
				const result = await Handlers.ExecuteAutocomplete(interaction);
				return res.send(result);
			}

			default:
				throw 'Unknown Type';
		}
	});
};