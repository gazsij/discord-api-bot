import { InteractionResponseType, MessageFlags } from 'discord-api-types/v9';
import { ICommand } from '../../Types/Builders';

export default {
	name: 'ping',
	description: 'Replies with Pong!',
	execute: async () => {
		return {
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				content: 'Pong!',
				flags: MessageFlags.Ephemeral
			}
		};
	}
} as ICommand;