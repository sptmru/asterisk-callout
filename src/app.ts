import Fastify from 'fastify';

import { config } from './config';
import { logger } from './misc/Logger';

const fastify = Fastify({
  logger: false
});

fastify.get('/health', function (_request, reply) {
  reply.send({ status: 'healthy' });
});

fastify.listen({ port: config.httpPort }, function (err): void {
  if (err) {
    logger.error(`Failed to start Fastify server: ${err}`);
  }
});
