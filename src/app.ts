import Fastify from 'fastify';
import * as ari from 'ari-client';
import { Client } from 'ari-client';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { config, ariUrl } from './config';
import { logger } from './misc/Logger';
import { StasisAppsService } from './services/StasisAppsService';
import { dataSource, dataSourceInitializer } from './data-source';
import { swaggerOptions } from './routes/swagger/swagger';
import { swaggerUiOptions } from './routes/swagger/swagger-ui';
import { playbackCalloutHandler } from './routes/calls/playback-callout';
import { healthcheckHandler } from './routes/health/healthcheckHandler';

const fastify = Fastify({
  logger: false
});

(async () => {
  await dataSourceInitializer(dataSource);

  const stasisHandler = async (client: Client): Promise<void> => {
    await StasisAppsService.startStasisApp(client, config.ari.app);

    global.ariData = {
      client,
      appName: config.ari.app,
      channel: client.Channel()
    };

    fastify.register(fastifySwagger, swaggerOptions);
    fastify.register(fastifySwaggerUi, swaggerUiOptions);

    fastify.register(playbackCalloutHandler);

    fastify.register(healthcheckHandler);

    fastify.listen({ port: config.httpPort }, function (err): void {
      if (err) {
        logger.error(`Failed to start Fastify server: ${err}`);
      }
    });
  };

  ari
    .connect(ariUrl, config.ari.username, config.ari.password)
    .then(stasisHandler)
    .catch(err => {
      logger.error(`Error connecting to ARI: ${err}`);
      process.exit(1);
    });
})();
