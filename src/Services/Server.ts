import path from 'path';
import debug from 'debug';
import fastify, { FastifyInstance, FastifyError } from 'fastify';
import autoload from 'fastify-autoload';

import { Config } from '../Utilities/Config';

export class Server {
	private static logSystem = debug('discord-api-bot:api:system');
	private static logEvent = debug('discord-api-bot:api:event');
	private static logError = debug('discord-api-bot:api:error');

	private static port = Config.Options.PORT;
	private static app: FastifyInstance;

	public static async Setup(): Promise<void> {

		Server.logSystem('Starting server...');

		Server.app = fastify({ logger: false });
		Server.app.register(autoload, {
			dir: path.join(__dirname, '../Plugins')
		});
		Server.app.register(autoload, {
			dir: path.join(__dirname, '../Controllers'),
			options: { prefix: '/api/' },
			routeParams: false
		});

		Server.app.setErrorHandler(async (error: FastifyError) => {
			!Config.Options.IS_PROD && Server.logError(error);
			return {
				ok: false,
				status: 500,
				data: error.message
			};
		});

		await Server.app.listen(Server.port, '127.0.0.1');

		Server.logSystem(`Server running on port: ${Server.port}`);
	}

	public static async Close(): Promise<void> {
		await Server.app.close();
		Server.logEvent('Closed server.');
	}
}
