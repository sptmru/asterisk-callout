import { FastifyReply, FastifyRequest } from 'fastify';
import { GetExtensionsByStatusParams } from '../../domain/types/extensions/getExtensionsByStatusQuerystring.type';
import { ExtensionService } from '../../services/extension.service';
import { logger } from '../../misc/Logger';
import { CreateExtensionBody } from '../../domain/types/extensions/createExtensionBody.type';
import { Extension } from '../../domain/entities/extension.entity';
import { dataSource } from '../../infrastructure/database/data-source';
import { UpdateExtensionBody } from '../../domain/types/extensions/updateExtensionBody.type';
import {
  DeleteExtensionParams,
  GetExtensionParams,
  UpdateExtensionParams,
} from '../../domain/types/extensions/updateExtensionParams.type';
import { UpdateExtensionStatusBody } from '../../domain/types/extensions/updateExtensionStatusBody';

export class ExtensionController {
  static async getAllExtensions(_request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const extensions = await ExtensionService.getExtensions();
      return reply.code(200).send(extensions);
    } catch (err) {
      logger.error(`Error while getting all extensions ${err.message}`);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async getExtension(
    request: FastifyRequest<{ Params: GetExtensionParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { extension_number } = request.params;
      const extension = await ExtensionService.getExtensionByNumber(extension_number);
      if (extension === null) {
        return reply.code(404).send({ error: `Extension ${extension_number} not found` });
      }

      return reply.code(200).send(extension);
    } catch (err) {
      logger.error(`Error while getting all extensions ${err.message}`);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async getExtensionsByStatus(
    request: FastifyRequest<{ Params: GetExtensionsByStatusParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { status } = request.params;
      const extensions = await ExtensionService.getExtensionsByStatus(status);
      return reply.code(200).send(extensions);
    } catch (err) {
      logger.error(`Error while looking for extensions by status: ${err.message}`);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  }

  static async createExtension(
    request: FastifyRequest<{ Body: CreateExtensionBody }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { sip_driver, extension_number } = request.body;

      const existingExtension = await ExtensionService.getExtensionByNumber(extension_number);
      if (existingExtension !== null) {
        return reply.code(400).send({ error: `Extension ${extension_number} already exists` });
      }

      const extension = await ExtensionService.createExtension({ sip_driver, extension_number });
      return reply.code(201).send(extension);
    } catch (err) {
      logger.error(`Error while creating an extension: ${err.message}`);
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
      if (request.body.sip_driver !== undefined) {
        extension.sip_driver = request.body.sip_driver;
      }

      if (request.body.extension_number !== undefined) {
        const new_extension_number = request.body.extension_number;
        const existingExtension = await dataSource
          .getRepository(Extension)
          .createQueryBuilder('extension')
          .where('extension.extension_number = :new_extension_number', { new_extension_number })
          .andWhere('extension.id != :currentId', { currentId: extension.id })
          .getOne();

        if (existingExtension !== null) {
          return reply.code(400).send({ error: `Extension ${new_extension_number} already exists` });
        }

        extension.extension_number = new_extension_number;
      }

      extension = await dataSource.manager.save(extension);
      return reply.code(200).send(extension);
    } catch (err) {
      logger.error(`Error while updating a controller: ${err.message}`);
      return reply.code(500).send('Internal server error');
    }
  }

  static async deleteExtension(
    request: FastifyRequest<{ Params: DeleteExtensionParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { extension_number } = request.params;
      const extension = await ExtensionService.getExtensionByNumber(extension_number);
      if (extension === null) {
        return reply.code(404).send({ error: `Extension ${extension_number} not found` });
      }

      await ExtensionService.deleteExtension(extension);
      return reply.code(204).send({ message: 'Extension deleted successfully' });
    } catch (err) {
      logger.error(`Error while deleting an extension: ${err.message}`);
      return reply.code(500).send('Internal server error');
    }
  }

  static async changeExtensionStatus(
    request: FastifyRequest<{ Params: UpdateExtensionParams; Body: UpdateExtensionStatusBody }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    try {
      const { extension_number } = request.params;
      const { status } = request.body;

      const extension = await dataSource.getRepository(Extension).findOne({ where: { extension_number } });
      if (extension === null) {
        return reply.code(404).send({ error: `Extension ${extension_number} not found` });
      }

      extension.data.state = status;
      await dataSource.manager.save(extension.data);
      return reply.code(200).send(extension);
    } catch (err) {
      logger.error(`Error while changing extension status: ${err.message}`);
      return reply.code(500).send('Internal server error');
    }
  }
}
