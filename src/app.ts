import * as ari from 'ari-client';
import { Client } from 'ari-client';

import { config, ariUrl } from './config';
import { logger } from './misc/Logger';
import { StasisAppsService } from './services/StasisAppsService';
import { dataSource, dataSourceInitializer } from './data-source';
import { api } from './routes';

(async () => {
  await dataSourceInitializer(dataSource);

  const ariInitializer = async (client: Client): Promise<void> => {
    logger.info(`Successfully connected to ARI`);
    await StasisAppsService.startStasisApp(client, config.ari.app);

    global.ariData = {
      client,
      appName: config.ari.app,
      channel: client.Channel()
    };

    api.start(config.httpPort);
  };

  ari
    .connect(ariUrl, config.ari.username, config.ari.password)
    .then(ariInitializer)
    .catch(err => {
      logger.error(`Error connecting to ARI: ${err}`);
      process.exit(1);
    });
})();
