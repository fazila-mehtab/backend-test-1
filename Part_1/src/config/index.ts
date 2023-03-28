interface DataSource {
	host: string
	port: number
	username: string
	password: string
}
interface AppConfig {
	appPort: number
	env: string
	isDev: boolean
	isProd: boolean
	affiliateDb: DataSource
}

export const appConfig: AppConfig = {
	appPort: +(process.env.APP_PORT || '3000'),
	env: process.env.NODE_ENV || 'development',
	isDev: (process.env.NODE_ENV || 'development') === 'development',
	isProd: process.env.NODE_ENV === 'production',
	affiliateDb: {
		host: process.env.AFFILIATE_DB_HOST || '',
		port: +(process.env.AFFILIATE_DB_PORT || ''),
		username: process.env.AFFILIATE_DB_USERNAME || '',
		password: process.env.AFFILIATE_DB_PASSWORD || '',
	},
}
