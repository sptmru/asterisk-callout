import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { logger } from '../misc/Logger';
import { swaggerOptions } from './swagger/swagger';
import { swaggerUiOptions } from './swagger/swagger-ui';
import { playbackCalloutHandler } from './calls/playback-callout';
import { healthcheckHandler } from './health/healthcheckHandler';

const fastify = Fastify({
  logger: false
});

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);

fastify.register(playbackCalloutHandler);

fastify.register(healthcheckHandler);

export const api = {
  start: (port: number): void => {
    fastify.listen({ port }, function (err): void {
      if (err) {
        logger.error(`Failed to start Fastify server: ${err}`);
      } else {
        logger.info(`Fastify server started on port ${port}`);
      }
    });
    return;
  }
};
