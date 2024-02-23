import { FastifyInstance } from 'fastify';
import {
  createExtensionOptions,
  deleteExtensionOptions,
  getAllExtensions,
  getExtension,
  getExtensionsByStatusOptions,
  updateExtensionOptions,
  updateExtensionStatusOptions
} from './extensions.route-options';
import { ExtensionsController } from '../../controllers/extensions/extensions.controller';

export class ExtensionsRoute {
  public prefix: string = '/extensions';

  // eslint-disable-next-line require-await
  async routes(fastify: FastifyInstance): Promise<void> {
    fastify.get('', getAllExtensions, ExtensionsController.getAllExtensions);
    fastify.get('/:extension_number', getExtension, ExtensionsController.getExtension);
    fastify.get('/filter/:status', getExtensionsByStatusOptions, ExtensionsController.getExtensionsByStatus);
    fastify.post('', createExtensionOptions, ExtensionsController.createExtension);
    fastify.put('/:extension_number', updateExtensionOptions, ExtensionsController.updateExtension);
    fastify.delete('/:extension_number', deleteExtensionOptions, ExtensionsController.deleteExtension);

    fastify.put('/:extension_number/status', updateExtensionStatusOptions, ExtensionsController.changeExtensionStatus);
  }
}
