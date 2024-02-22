import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
  createExtensionOptions,
  deleteExtensionOptions,
  getAllExtensions,
  getExtensionsByStatusOptions,
  updateExtensionOptions
} from './extensions.route-options';
import { ExtensionsController } from '../../controllers/extensions/extensions.controller';

export class ExtensionsRoute {
  public prefix: string = '/extensions';

  async routes(fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<void> {
    fastify.get('', getAllExtensions, ExtensionsController.getAllExtensions);
    fastify.get('/:status', getExtensionsByStatusOptions, ExtensionsController.getExtensionsByStatus);
    fastify.post('', createExtensionOptions, ExtensionsController.createExtension);
    fastify.put('/:extension_number', updateExtensionOptions, ExtensionsController.updateExtension);
    fastify.delete('/:extension_number', deleteExtensionOptions, ExtensionsController.deleteExtension);
  }
}
