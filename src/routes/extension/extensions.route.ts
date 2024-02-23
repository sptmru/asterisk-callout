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
    fastify.get('/:extensionNumber', getExtension, ExtensionController.getExtension);
    fastify.get('/filter/:status', getExtensionsByStatusOptions, ExtensionController.getExtensionsByStatus);
    fastify.post('', createExtensionOptions, ExtensionController.createExtension);
    fastify.put('/:extensionNumber', updateExtensionOptions, ExtensionController.updateExtension);
    fastify.delete('/:extensionNumber', deleteExtensionOptions, ExtensionController.deleteExtension);

    fastify.put('/:extensionNumber/status', updateExtensionStatusOptions, ExtensionController.changeExtensionStatus);
  }
}
