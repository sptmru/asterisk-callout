import { FastifyReply, FastifyRequest } from 'fastify';
import { getExtensionsByStatusParams } from '../../domain/types/getExtensionsByStatusQuerystring.type';
import { ExtensionsService } from '../../services/ExtensionsService';
import { logger } from '../../misc/Logger';

export class ExtensionsController {
  static async getExtensionsByStatus(
    request: FastifyRequest<{ Params: getExtensionsByStatusParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { status } = request.params;
      const extensions = await ExtensionsService.getExtensionsByStatus(status);
      return reply.code(200).send({ extensions });
    } catch (err) {
      logger.error(`Error while looking for extensions by status: ${err}`);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
