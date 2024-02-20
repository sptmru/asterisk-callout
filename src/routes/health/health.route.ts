import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { healthGetRouteOptions } from './health.route-options';
import { HealthController } from '../../controllers/health/health.controller';

export class HealthRoute {
  public prefix = '/health';

  async routes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.get('', healthGetRouteOptions, HealthController.healthcheck);
  }
}
