import { RouteOptionsWithoutHandler } from '../../infrastructure/api/types/RouteOptionsWithoutHandler';

export const calloutPlaybackRouteOptions: RouteOptionsWithoutHandler = {
  method: 'POST',
  url: '/api/v1/callout/playback',
  schema: {
    description:
      'Accepts a list of phone numbers and initiates a callout by this list. Once answered, plays a message and hangs up.',
    summary: 'Callout with playback',
    tags: ['calls'],
    body: {
      type: 'object',
      required: ['numbers'],
      properties: {
        numbers: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          message: { type: 'string' }
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
