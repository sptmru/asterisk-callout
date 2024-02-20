export const healthcheckOptions = {
  method: 'GET',
  url: '/health',
  schema: {
    tags: ['monitoring'],
    description: 'A healthcheck endpoint. Returns 200 if the API is alive, returns nothing if it is not',
    summary: 'Healtcheck endpoint'
  },
  response: {
    200: {
      description: 'Successful response',
      type: 'object',
      properties: {
        status: { type: 'string' }
      }
    }
  }
};
