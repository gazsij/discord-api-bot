import 'dotenv/config';

import { ExitHandler } from './Utilities/ExitHandler';
import { Server } from './Services/Server';

(async (): Promise<void> => {

	ExitHandler.Setup();

	await Server.Setup();

	ExitHandler.Configure(async () => {
		await Server.Close();
	});
})();