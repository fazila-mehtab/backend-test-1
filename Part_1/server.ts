import app from './app'
import { appConfig } from './src/config'
import { logger } from './src/utils'

app.listen(appConfig.appPort, async () => {
	logger.info(`App is running on port ${appConfig.appPort} in ${appConfig.env} mode`)
})
