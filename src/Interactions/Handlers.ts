import debug from 'debug';
import path from 'path';
import { promisify } from 'util';
import glob from 'glob';
import {
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandAutocompleteResponse,
	APIChatInputApplicationCommandInteraction,
	APIContextMenuInteraction,
	APIMessageComponentInteraction,
	InteractionResponseType,
	MessageFlags
} from 'discord-api-types/v9';

import { HandlerType } from '../Types/Constants';
import { IImportable, APIInteractionCommandResponse, ICommand, IExport, IContextMenu, IButton, IAutocomplete, ISelectMenu } from '../Types/Builders';
import { API } from '../Utilities/API';

const globPromise = promisify(glob);

const logSystem = debug('discord-api-bot:handlers:system');
const logError = debug('discord-api-bot:handlers:error');

export class Handlers {

	private static handlers: { [type: string]: { [name: string]: IImportable } };

	static async Setup(): Promise<void> {
		Handlers.handlers = {};

		for (const type of Object.values(HandlerType))
			Handlers.handlers[type] = await Handlers.ImportFiles(type);
	}

	private static async ImportFiles<T extends IImportable>(handlerType: HandlerType) {
		const imports: { [name: string]: T } = {};

		const folder = path.resolve(`${__dirname}/${handlerType}/*{.js,.ts}`);
		const files = await globPromise(folder);
		if (!files.length)
			return imports;

		for (const file of files) {
			const { default: data } = await import(file) as IExport<T>;
			imports[data.name] = data;
		}

		logSystem(`Imported ${handlerType}: ${Object.keys(imports).length}`);
		return imports;
	}

	static async Register() {
		logSystem('Started refreshing application commands and context menus.');

		const commands = await Handlers.ImportFiles<ICommand>(HandlerType.Commands);
		const contextMenus = await Handlers.ImportFiles<IContextMenu>(HandlerType.ContextMenus);

		const body = [...Object.values(commands), ...Object.values(contextMenus)];

		await API.updateCommands(body);

		logSystem('Successfully reloaded application commands and context menus.');
	}

	static async ExecuteCommand(interaction: APIChatInputApplicationCommandInteraction): Promise<APIInteractionCommandResponse> {
		try {
			const commands = Handlers.handlers[HandlerType.Commands];
			if (!commands)
				throw 'No commands registered.';

			const command = commands[interaction.data.name] as ICommand;
			if (!command)
				throw `Command ${interaction.data.name} not found.`;

			return command.execute(interaction);
		}
		catch (error) {
			logError(error);
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'An error occured using this command.  Please try again later.',
					flags: MessageFlags.Ephemeral
				}
			};
		}
	}

	static async ExecuteContextMenu(interaction: APIContextMenuInteraction): Promise<APIInteractionCommandResponse> {
		try {
			const contextMenus = Handlers.handlers[HandlerType.ContextMenus];
			if (!contextMenus)
				throw 'No contextMenus registered.';

			const contextMenu = contextMenus[interaction.data.name] as IContextMenu;
			if (!contextMenu)
				throw `ContextMenu ${interaction.data.name} not found.`;

			return contextMenu.execute(interaction);
		}
		catch (error) {
			logError(error);
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'An error occured using this command.  Please try again later.',
					flags: MessageFlags.Ephemeral
				}
			};
		}
	}

	static async ExecuteButton(interaction: APIMessageComponentInteraction): Promise<APIInteractionCommandResponse> {
		try {
			const buttons = Handlers.handlers[HandlerType.Buttons];
			if (!buttons)
				throw 'No buttons registered.';

			const button = buttons[interaction.data.custom_id] as IButton;
			if (!button)
				throw `Button ${interaction.data.custom_id} not found.`;

			return button.execute(interaction);
		}
		catch (error) {
			logError(error);
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'An error occured using this button.  Please try again later.',
					flags: MessageFlags.Ephemeral
				}
			};
		}
	}

	static async ExecuteSelectMenu(interaction: APIMessageComponentInteraction): Promise<APIInteractionCommandResponse> {
		try {
			const selectMenus = Handlers.handlers[HandlerType.SelectMenus];
			if (!selectMenus)
				throw 'No selectMenus registered.';

			const selectMenu = selectMenus[interaction.data.custom_id] as ISelectMenu;
			if (!selectMenu)
				throw `SelectMenu ${interaction.data.custom_id} not found.`;

			return selectMenu.execute(interaction);
		}
		catch (error) {
			logError(error);
			return {
				type: InteractionResponseType.ChannelMessageWithSource,
				data: {
					content: 'An error occured using this select menu.  Please try again later.',
					flags: MessageFlags.Ephemeral
				}
			};
		}
	}

	static async ExecuteAutocomplete(interaction: APIApplicationCommandAutocompleteInteraction): Promise<APIApplicationCommandAutocompleteResponse> {
		try {
			const autocompletes = Handlers.handlers[HandlerType.Autocompletes];
			if (!autocompletes)
				throw 'No autocompletes registered.';

			const selectMenu = autocompletes[interaction.data.name] as IAutocomplete;
			if (!selectMenu)
				throw `Autocomplete ${interaction.data.name} not found.`;

			return selectMenu.execute(interaction);
		}
		catch (error) {
			logError(error);
			return {
				type: InteractionResponseType.ApplicationCommandAutocompleteResult,
				data: {
					choices: []
				}
			};
		}
	}
}