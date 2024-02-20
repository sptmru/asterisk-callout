import { playbackCalloutBody } from '../../types/PlaybackCalloutBody';
import { playbackCalloutOptions } from './playback-callout-options';
import { PhoneNumberWithSound } from '../../types/ListOfNumbers';
import { CalloutService } from '../../services/CalloutService';
import { logger } from '../../misc/Logger';
import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export const playbackCalloutHandler = (app: FastifyInstance, _options: FastifyPluginOptions, done: () => void) => {
  app.post<{ Body: playbackCalloutBody }>(
    '/api/v1/calls/playback-callout',
    playbackCalloutOptions,
    async function (request, reply) {
      try {
        const { numbers } = request.body;
        const listOfNumbers: PhoneNumberWithSound[] = numbers.map(number => {
          return { number, sound: 'demo-thanks' };
        });
        await CalloutService.initiateBulkPlaybackCalls(global.ariData, listOfNumbers);
        reply.code(200).send({ message: 'Callout with playback started' });
      } catch (err) {
        logger.error(`Error in /api/calls/playback-callout: ${err}`);
        reply.code(500).send({ error: 'An error occurred during processing.' });
      }
    }
  );
  done();
};
