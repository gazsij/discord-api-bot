import {
	APIMessageComponentInteraction,
	APIApplicationCommandAutocompleteInteraction,
	APIApplicationCommandAutocompleteResponse,
	APIInteractionResponseChannelMessageWithSource,
	APIInteractionResponseDeferredChannelMessageWithSource,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	APIContextMenuInteraction,
	APIChatInputApplicationCommandInteraction
} from 'discord-api-types/v9';

export type APIInteractionCommandResponse = APIInteractionResponseChannelMessageWithSource | APIInteractionResponseDeferredChannelMessageWithSource;

export interface ICommand extends RESTPostAPIChatInputApplicationCommandsJSONBody {
	execute: (interaction: APIChatInputApplicationCommandInteraction) => Promise<APIInteractionCommandResponse>
}

export interface IContextMenu extends RESTPostAPIContextMenuApplicationCommandsJSONBody {
	execute: (interaction: APIContextMenuInteraction) => Promise<APIInteractionCommandResponse>
}

export interface IButton {
	name: string
	execute: (interaction: APIMessageComponentInteraction) => Promise<APIInteractionCommandResponse>
}

export interface ISelectMenu {
	name: string
	placeholder: string
	options: ISelectMenuOptions[]
	execute: (interaction: APIMessageComponentInteraction) => Promise<APIInteractionCommandResponse>
}

export interface ISelectMenuOptions {
	label: string
	description: string
	value: string
}

export interface IAutocomplete {
	name: string
	execute: (interaction: APIApplicationCommandAutocompleteInteraction) => Promise<APIApplicationCommandAutocompleteResponse>
}

export type IImportable = ICommand | IButton | ISelectMenu | IAutocomplete | IContextMenu;

export interface IExport<T extends IImportable> {
	default: T
}