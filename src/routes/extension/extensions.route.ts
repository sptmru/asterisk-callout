import { FastifyInstance } from 'fastify';
import {
  createExtensionOptions,
  deleteExtensionOptions,
  getAllExtensions,
  getExtension,
  getExtensionsByStatusOptions,
  updateExtensionOptions,
  updateExtensionStatusOptions,
} from './extensions.route-options';
import { ExtensionController } from '../../controllers/extension/extension.controller';

export class ExtensionRoute {
  public prefix: string = '/extensions';

  // eslint-disable-next-line require-await
  async routes(fastify: FastifyInstance): Promise<void> {
    fastify.get('', getAllExtensions, ExtensionController.getAllExtensions);
    fastify.get('/:extension_number', getExtension, ExtensionController.getExtension);
    fastify.get('/filter/:status', getExtensionsByStatusOptions, ExtensionController.getExtensionsByStatus);
    fastify.post('', createExtensionOptions, ExtensionController.createExtension);
    fastify.put('/:extension_number', updateExtensionOptions, ExtensionController.updateExtension);
    fastify.delete('/:extension_number', deleteExtensionOptions, ExtensionController.deleteExtension);

    fastify.put('/:extension_number/status', updateExtensionStatusOptions, ExtensionController.changeExtensionStatus);
  }
}
