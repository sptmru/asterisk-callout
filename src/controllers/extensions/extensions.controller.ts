import { FastifyReply, FastifyRequest } from 'fastify';
import { GetExtensionsByStatusParams } from '../../domain/types/extensions/getExtensionsByStatusQuerystring.type';
import { ExtensionsService } from '../../services/ExtensionsService';
import { logger } from '../../misc/Logger';
import { CreateExtensionBody } from '../../domain/types/extensions/createExtensionBody.type';
import { Extension } from '../../domain/entities/extension.entity';
import { dataSource } from '../../infrastructure/database/data-source';

export class ExtensionsController {
  static async getExtensionsByStatus(
    request: FastifyRequest<{ Params: GetExtensionsByStatusParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { status } = request.params;
      const extensions = await ExtensionsService.getExtensionsByStatus(status);
      return reply.code(200).send(extensions);
    } catch (err) {
      logger.error(`Error while looking for extensions by status: ${err}`);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async createExtension(
    request: FastifyRequest<{ Body: CreateExtensionBody }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { sip_driver, extension_number } = request.body;
      const extensionData = new Extension();
      extensionData.sip_driver = sip_driver;
      extensionData.extension_number = extension_number;

      const extension = await dataSource.manager.save(extensionData);
      return reply.code(201).send(extension);
    } catch (err) {
      logger.error(`Error while creating an extension: ${err}`);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }
}
