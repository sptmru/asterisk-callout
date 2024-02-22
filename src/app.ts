import * as ari from 'ari-client';
import { Client } from 'ari-client';

import { config, ariUrl } from './infrastructure/config/config';
import { logger } from './misc/Logger';
import { StasisAppsService } from './services/StasisAppsService';
import { dataSource, dataSourceInitializer } from './infrastructure/database/data-source';
import { Api } from './infrastructure/api/server';
import { HealthRoute } from './routes/health/health.route';
import { CalloutRoute } from './routes/callout/callout.route';
import { ExtensionDefinition } from './domain/definitions/extension.definition';
import { ExtensionsRoute } from './routes/extensions/extensions.route';

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

    const api = new Api({
      plugins: [],
      routes: [HealthRoute, CalloutRoute, ExtensionsRoute],
      definitions: [ExtensionDefinition]
    });
    api.listen();
  };

  ari
    .connect(ariUrl, config.ari.username, config.ari.password)
    .then(ariInitializer)
    .catch(err => {
      logger.error(`Error connecting to ARI: ${err}`);
      process.exit(1);
    });
})();
