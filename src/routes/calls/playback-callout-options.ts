export const playbackCalloutOptions = {
  method: 'POST',
  url: '/api/v1/calls/playback-callout',
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
