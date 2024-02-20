import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { healthcheckOptions } from './healthcheckOptions';

export const healthcheckHandler = (app: FastifyInstance, _options: FastifyPluginOptions, done: () => void) => {
  app.get('/health', healthcheckOptions, function (_request, reply) {
    reply.code(200).send({ status: 'healthy' });
  });
  done();
};
