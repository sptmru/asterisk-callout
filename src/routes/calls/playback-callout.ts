export const playbackCalloutOptions = {
  method: 'POST',
  url: '/api/v1/calls/playback-callout',
  schema: {
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
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      500: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
};
