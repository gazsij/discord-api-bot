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
}