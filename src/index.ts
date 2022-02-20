import 'dotenv/config';

import { ExitHandler } from './Utilities/ExitHandler';
import { Server } from './Services/Server';
import { Handlers } from './Interactions/Handlers';

(async (): Promise<void> => {

	ExitHandler.Setup();

	await Handlers.Setup();

	await Server.Setup();

	ExitHandler.Configure(async () => {
		await Server.Close();
	});
})();