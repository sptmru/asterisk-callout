import { RouteOptionsWithoutHandler } from '../../infrastructure/api/types/RouteOptionsWithoutHandler';
import { ExtensionStatusEnum } from '../../domain/enums/extensionstatus.enum';

export const getExtensionsByStatusOptions: RouteOptionsWithoutHandler = {
  method: 'get',
  url: '/api/v1/extensions/:status',
  schema: {
    description: 'Accepts a status in the URL and looks for extensions with this status in the DB',
    summary: 'Get extensions with given status',
    tags: ['extensions'],
    params: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: Object.values(ExtensionStatusEnum) }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          extensions: { type: 'array', items: { $ref: 'Extension#' } }
        }
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
};
