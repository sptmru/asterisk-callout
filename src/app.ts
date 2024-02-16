import Fastify from 'fastify';
import * as ari from 'ari-client';

import { config, ariUrl } from './config';
import { logger } from './misc/Logger';
import { CalloutService } from './services/CalloutService';
import { Client } from 'ari-client';
import { PhoneNumberWithSound } from './types/ListOfNumbers';
import { playbackCalloutOptions } from './routes/calls/playback-callout';
import { playbackCalloutBody } from './types/PlaybackCalloutBody';

const fastify = Fastify({
  logger: false
});

(async () => {
  const stasisHandler = async (client: Client): Promise<void> => {
    await client.start(config.ari.app);

    const ariData = {
      client,
      appName: config.ari.app,
      channel: client.Channel()
    };

    fastify.post<{ Body: playbackCalloutBody }>(
      '/api/v1/calls/playback-callout',
      playbackCalloutOptions,
      async function (request, reply) {
        try {
          const { numbers } = request.body;
          const listOfNumbers: PhoneNumberWithSound[] = numbers.map(number => {
            return { number, sound: 'demo-thanks' };
          });
          await CalloutService.initiateBulkPlaybackCalls(ariData, listOfNumbers);
          reply.code(200).send({ message: 'Callout with playback started' });
        } catch (err) {
          logger.error(`Error in /api/calls/playback-callout: ${err}`);
          reply.code(500).send({ error: 'An error occurred during processing.' });
        }
      }
    );

    fastify.get('/health', function (_request, reply) {
      reply.send({ status: 'healthy' });
    });

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
