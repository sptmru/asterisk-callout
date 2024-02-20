import { config } from '../../config';

export const swaggerOptions = {
  openapi: {
    info: {
      title: 'Asterisk Callout API',
      description: 'Asterisk Callout API Documentation',
      version: '1.0.0'
    },
    servers: [
      {
        url: config.httpHostname
      }
    ],
    components: {},
    tags: [
      {
        name: 'Root',
        description: 'Root endpoints'
      }
    ]
  }
};
