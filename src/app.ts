import * as ari from 'ari-client';
import { Client } from 'ari-client';

import { config, ariUrl } from './infrastructure/config/config';
import { logger } from './misc/Logger';
import { StasisAppService } from './services/stasisapp.service';
import { dataSource, dataSourceInitializer } from './infrastructure/database/data-source';
import { Api } from './infrastructure/api/server';
import { HealthRoute } from './routes/health/health.route';
import { CalloutRoute } from './routes/callout/callout.route';
import { ExtensionDefinition } from './domain/definitions/extension.definition';
import { ExtensionRoute } from './routes/extension/extensions.route';
import { ExtensionStatusDefinition } from './domain/definitions/extensionStatus.definition';

/* eslint-disable @typescript-eslint/no-floating-promises */
(async (): Promise<void> => {
  await dataSourceInitializer(dataSource);

  const ariInitializer = async (client: Client): Promise<void> => {
    logger.info(`Successfully connected to ARI`);
    await StasisAppService.startStasisApp(client, config.ari.app);

    global.ariData = {
      client,
      appName: config.ari.app,
      channel: client.Channel(),
    };

    const api = new Api({
      plugins: [],
      routes: [HealthRoute, CalloutRoute, ExtensionRoute],
      definitions: [ExtensionDefinition, ExtensionStatusDefinition],
    });
    api.listen();
  };

  ari
    .connect(ariUrl, config.ari.username, config.ari.password)
    .then(ariInitializer)
    .catch(err => {
      logger.error(`Error connecting to ARI: ${err.message}`);
      process.exit(1);
    });
})();
/* eslint-enable @typescript-eslint/no-floating-promises */
