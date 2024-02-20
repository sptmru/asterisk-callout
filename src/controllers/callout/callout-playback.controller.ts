import { FastifyReply, FastifyRequest } from 'fastify';
import { PhoneNumberWithSound } from '../../domain/types/phonenumberwithsound.type';
import { CalloutService } from '../../services/CalloutService';
import { logger } from '../../misc/Logger';
import { playbackCalloutBody } from '../../domain/types/playbackcalloutbody.type';
import { ErrorInterface, SuccessInterface } from '../../domain/interfaces/response.interface';

export class CalloutPlaybackController {
  static async calloutPlayback(
    request: FastifyRequest<{ Body: playbackCalloutBody }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { numbers } = request.body;
      const listOfNumbers: PhoneNumberWithSound[] = numbers.map(number => {
        return { number, sound: 'demo-thanks' };
      });
      await CalloutService.initiateBulkPlaybackCalls(global.ariData, listOfNumbers);
      const response: SuccessInterface = { success: { code: 200, message: 'Callout with playback started' } };
      return reply.code(200).send(response);
    } catch (err) {
      logger.error(`Error while handling playback callout: ${err}`);
      const response: ErrorInterface = { error: { code: 500, message: 'Internal server error' } };
      return reply.code(500).send(response);
    }
  }
}
