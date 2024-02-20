import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { CalloutPlaybackController } from '../../controllers/callout/callout-playback.controller';
import { calloutPlaybackRouteOptions } from './callout.route-options';

export class CalloutRoute {
  public prefix: string = '/callout';

  async routes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
    fastify.post('/playback', calloutPlaybackRouteOptions, CalloutPlaybackController.calloutPlayback);
  }
}
