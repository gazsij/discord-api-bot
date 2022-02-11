import path from 'path';

export class Config {

	public static Options = {
		PORT: process.env.PORT || 5000,
		NODE_ENV: process.env.NODE_ENV || 'development',
		IS_PROD: process.env.NODE_ENV === 'production' ? true : false,
		IS_COMPILED: path.extname(__filename).includes('js') ? true : false
	};
}