import path from 'path';
import { Env } from '../Types/Constants';

export class Config {

	static readonly NODE_ENV = <Env>process.env.NODE_ENV ?? Env.dev;

	// generic
	static readonly IS_PROD = (process.env.IS_PROD == Env.prod) ? true : false;
	static readonly IS_COMPILED = path.extname(__filename).includes('js');

	// api
	static readonly PORT = parseInt(process.env.PORT as string) ?? 3000;
	static readonly SUBDOMAIN = process.env.SUBDOMAIN;

	// discord
	static readonly BOT_TOKEN = process.env.BOT_TOKEN as string;
	static readonly PUBLIC_KEY = process.env.PUBLIC_KEY as string;
	static readonly APPLICATION_ID = process.env.APPLICATION_ID as string;
	static readonly MAX_TIMEOUT = parseInt(process.env.MAX_TIMEOUT as string) ?? 5000;
}