import { Handlers } from '../src/Interactions/Handlers';
import debug from 'debug';

const logError = debug('discord-api-bot:scripts:error');

(async () => {
	try {
		await Handlers.Register();
	} catch (error) {
		logError(error);
	}
})();