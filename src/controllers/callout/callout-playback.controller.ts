import { FastifyReply, FastifyRequest } from 'fastify';
import { PhoneNumberWithSound } from '../../domain/types/phonenumberwithsound.type';
import { CalloutService } from '../../services/callout.service';
import { logger } from '../../misc/Logger';
import { PlaybackCalloutBody } from '../../domain/types/playbackcalloutbody.type';

export class CalloutPlaybackController {
  static async calloutPlayback(
    request: FastifyRequest<{ Body: PlaybackCalloutBody }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { numbers } = request.body;
      const listOfNumbers: PhoneNumberWithSound[] = numbers.map(number => ({ number, sound: 'demo-thanks' }));
      await CalloutService.initiateBulkPlaybackCalls(global.ariData, listOfNumbers);
      return reply.code(200).send({ message: 'Callout with playback started' });
    } catch (err) {
      logger.error(`Error while handling playback callout: ${err.message}`);
      return reply.code(500).send({ error: 'Internal serveaaaaaaar error' });
    }
  }

  static async calloutFreeOperators(_request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      await CalloutService.callAllAvailableOperators(global.ariData);
      return reply.code(200).send({ message: 'Callout to all free operator started' });
    } catch (err) {
      logger.error(`Error while doing callout to free operators: ${err.message}`);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
