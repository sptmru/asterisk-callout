import { FastifyReply, FastifyRequest } from 'fastify';
import { GetExtensionsByStatusParams } from '../../domain/types/extensions/getExtensionsByStatusQuerystring.type';
import { ExtensionsService } from '../../services/ExtensionsService';
import { logger } from '../../misc/Logger';
import { CreateExtensionBody } from '../../domain/types/extensions/createExtensionBody.type';
import { Extension } from '../../domain/entities/extension.entity';
import { dataSource } from '../../infrastructure/database/data-source';
import { UpdateExtensionBody } from '../../domain/types/extensions/updateExtensionBody.type';
import { DeleteExtensionParams, UpdateExtensionParams } from '../../domain/types/extensions/updateExtensionParams.type';

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

  static async updateExtension(
    request: FastifyRequest<{ Body: UpdateExtensionBody; Params: UpdateExtensionParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { extension_number } = request.params;
      let extension = await dataSource.getRepository(Extension).findOne({ where: { extension_number } });
      if (extension === null) {
        return reply.code(404).send({ error: `Extension ${extension_number} not found` });
      }
      if (request.body?.sip_driver) {
        extension.sip_driver = request.body.sip_driver;
      }
      if (request.body?.extension_number) {
        extension.sip_driver = request.body.extension_number;
      }

      extension = await dataSource.manager.save(extension);
      return reply.code(200).send(extension);
    } catch (err) {
      logger.error(`Error while updating a controller: ${err}`);
      return reply.code(500).send('Internal server error');
    }
  }

  static async deleteExtension(
    request: FastifyRequest<{ Params: DeleteExtensionParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { extension_number } = request.params;
      const extension = await dataSource.getRepository(Extension).findOne({ where: { extension_number } });
      if (extension === null) {
        return reply.code(404).send({ error: `Extension ${extension_number} not found` });
      }

      await dataSource.manager.remove(extension);
      return reply.code(204).send({ message: 'Extension deleted successfully' });
    } catch (err) {
      logger.error(`Error while deleting an extension: ${err}`);
      return reply.code(500).send('Internal server error');
    }
  }
}
