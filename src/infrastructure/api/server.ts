/* eslint @typescript-eslint/no-explicit-any: 0 */

import Fastify, { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { config } from '../config/config';
import { logger } from '../../misc/Logger';
import { swaggerOptions } from '../../routes/swagger/swagger';
import { swaggerUiOptions } from '../../routes/swagger/swagger-ui';

export class Api {
  public app: FastifyInstance;
  public domain: string = config.api.hostname;
  public port: number = config.api.port;

  public basePrefix: string = '/api/v1';

  constructor(appInit: { plugins: any; routes: any; definitions: any }) {
    this.app = Fastify({
      logger: false
    });

    this.app.addHook('preHandler', (req, _reply, done) => {
      if (typeof req.body === 'object') {
        req.log.info({ body: req.body }, 'parsed body');
      }
      done();
    });

    /* eslint-disable @typescript-eslint/no-floating-promises */
    this.app.register(fastifySwagger, swaggerOptions);
    this.app.register(fastifySwaggerUi, swaggerUiOptions);
    /* eslint-enable @typescript-eslint/no-floating-promises */

    this.register(appInit.plugins);
    this.routes(appInit.routes);
    this.addDefinitions(appInit.definitions);
  }

  private register(plugins: { forEach: (arg0: (plugin: any) => void) => void }) {
    plugins.forEach(async plugin => {
      await this.app.register(plugin);
    });
  }

  public routes(routes: { forEach: (arg0: (routes: any) => void) => void }) {
    routes.forEach(async route => {
      const router = new route();
      await this.app.register(router.routes, { prefix: `${this.basePrefix}${router.prefix}` });
    });
  }

  private addDefinitions(definitions: { forEach: (arg0: (routes: any) => void) => void }) {
    definitions.forEach(definition => {
      this.app.addSchema(definition);
    });
  }

  public listen() {
    this.app.listen({ port: this.port }, function (err: Error | null): void {
      if (err) {
        logger.error(`Failed to start Fastify server: ${err.message}`);
        process.exit(1);
      } else {
        logger.info(`Fastify server started`);
      }
    });
  }
}
