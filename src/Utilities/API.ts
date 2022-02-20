import {
	APIApplicationCommand,
	APIApplicationCommandPermission,
	APIGuildApplicationCommandPermissions,
	Routes,
	RouteBases,
	RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v9';
import fetch from 'node-fetch';

import { Config } from './Config';

export class API {

	private static async GET<T>(url: string): Promise<T> {
		return API.Request<T>(url, 'GET');
	}

	private static async PUT<T, U>(url: string, data: T): Promise<U> {
		return API.Request<U>(url, 'PUT', data);
	}

	private static async POST<T, U>(url: string, data: T): Promise<U> {
		return API.Request<U>(url, 'POST', data);
	}

	private static async PATCH<T, U>(url: string, data: T): Promise<U> {
		return API.Request<U>(url, 'PATCH', data);
	}

	private static async DELETE<T>(url: string): Promise<T> {
		return API.Request<T>(url, 'DELETE');
	}

	private static async Request<T>(url: string, method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE', data?: unknown): Promise<T> {
		const response = await fetch(`${RouteBases.api}${url}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${Config.BOT_TOKEN}`,
			},
			method,
			body: data ? JSON.stringify(data) : undefined
		});

		return response.json() as Promise<T>;
	}

	/**
   * Gets the commands from an applicaton.
   * @param guildID The guild ID to get commands from. If undefined, global commands are fetched.
   */
	static async getCommands(guildID?: string): Promise<APIApplicationCommand[]> {
		const url = guildID
			? Routes.applicationGuildCommands(Config.APPLICATION_ID, guildID)
			: Routes.applicationCommands(Config.APPLICATION_ID);

		return API.GET<APIApplicationCommand[]>(url);
	}

	/**
   * Creates a command.
   * @param command The command to create.
   * @param guildID The guild ID to put the command on. If undefined, the command is global.
   */
	static async createCommand(command: RESTPostAPIApplicationCommandsJSONBody, guildID?: string): Promise<APIApplicationCommand> {
		const url = guildID
			? Routes.applicationGuildCommands(Config.APPLICATION_ID, guildID)
			: Routes.applicationCommands(Config.APPLICATION_ID);

		return API.POST<RESTPostAPIApplicationCommandsJSONBody, APIApplicationCommand>(url, command);
	}

	/**
   * Updates a command.
   * @param commandID The command ID to update.
   * @param command The payload to update the command to.
   * @param guildID The guild ID to put the command on. If undefined, the global command is updated.
   */
	static async updateCommand(commandID: string, command: RESTPostAPIApplicationCommandsJSONBody, guildID?: string): Promise<APIApplicationCommand> {
		const url = guildID
			? Routes.applicationGuildCommand(Config.APPLICATION_ID, guildID, commandID)
			: Routes.applicationCommand(Config.APPLICATION_ID, commandID);

		return API.PATCH<RESTPostAPIApplicationCommandsJSONBody, APIApplicationCommand>(url, command);
	}

	/**
	 * Updates multiple commands.
	 * @param commands The payload to update the commands to.
	 * @param guildID The guild ID to put the command on. If undefined, the global command is updated.
	 */
	static async updateCommands(commands: RESTPostAPIApplicationCommandsJSONBody[], guildID?: string): Promise<APIApplicationCommand[]> {
		const url = guildID
			? Routes.applicationGuildCommands(Config.APPLICATION_ID, guildID)
			: Routes.applicationCommands(Config.APPLICATION_ID);

		return API.PUT<RESTPostAPIApplicationCommandsJSONBody[], APIApplicationCommand[]>(url, commands);
	}

	/**
   * Deletes a command.
   * @param commandID The command ID to delete.
   * @param guildID The guild ID to delete the command. If undefined, the global command is deleted.
   */
	static async deleteCommand(commandID: string, guildID?: string): Promise<unknown> {
		const url = guildID
			? Routes.applicationGuildCommand(Config.APPLICATION_ID, guildID, commandID)
			: Routes.applicationCommand(Config.APPLICATION_ID, commandID);

		return API.DELETE(url);
	}

	static async getGuildCommandPermissions(guildID: string): Promise<APIGuildApplicationCommandPermissions[]> {
		const url = Routes.guildApplicationCommandsPermissions(Config.APPLICATION_ID, guildID);

		return API.GET<APIGuildApplicationCommandPermissions[]>(url);
	}

	static async getCommandPermissions(guildID: string, commandID: string): Promise<APIApplicationCommandPermission> {
		const url = Routes.applicationCommandPermissions(Config.APPLICATION_ID, guildID, commandID);

		return API.GET<APIApplicationCommandPermission>(url);
	}

	static async updateCommandPermissions(
		guildID: string,
		commandID: string,
		permissions: APIApplicationCommandPermission[]
	): Promise<APIGuildApplicationCommandPermissions> {
		const url = Routes.applicationCommandPermissions(Config.APPLICATION_ID, guildID, commandID);

		return API.PUT<APIApplicationCommandPermission[], APIGuildApplicationCommandPermissions>(url, permissions);
	}

	static async bulkUpdateCommandPermissions(
		guildID: string,
		commands: APIApplicationCommandPermission[]
	): Promise<APIGuildApplicationCommandPermissions[]> {
		const url = Routes.guildApplicationCommandsPermissions(Config.APPLICATION_ID, guildID);

		return API.PUT<APIApplicationCommandPermission[], APIGuildApplicationCommandPermissions[]>(url, commands);
	}

	/**
   * Responds to an interaction.
   * @param interactionID The interaction's ID.
   * @param interactionToken The interaction's token.
   * @param body The body to send.
   */
	static async interactionCallback(interactionID: string, interactionToken: string, body: unknown): Promise<unknown> {
		const url = Routes.interactionCallback(interactionID, interactionToken);

		return API.POST(url, body);
	}
}
