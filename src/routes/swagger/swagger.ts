import { config } from '../../config';

export const swaggerOptions = {
  openapi: {
    info: {
      title: 'Asterisk Callout API',
      description: 'Asterisk Callout API Documentation',
      version: '1.0.0'
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    servers: [
      {
        url: config.httpHostname
      }
    ],
    components: {},
    tags: [
      {
        name: 'calls',
        description: 'Calls endpoints'
      },
      {
        name: 'monitoring',
        description: 'Monitoring endpoints'
      }
    ]
  }
};