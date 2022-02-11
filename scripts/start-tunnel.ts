import debug from 'debug';

import localtunnel from 'localtunnel';
import { Config } from '../src/Utilities/Config';

const logSystem = debug('discord-api-bot:tunnel');

(async () => {
	const tunnel = await localtunnel({ port: Config.PORT, subdomain: Config.SUBDOMAIN });

	logSystem(`Tunnel opened at: ${tunnel.url}`);

	tunnel.on('close', () => {
		logSystem('Tunnel has been closed.');
	});
})();