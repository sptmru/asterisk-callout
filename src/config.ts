import * as dotenv from 'dotenv';

const parsedConfig = dotenv.config().parsed;

export const config = {
  logLevel: parsedConfig?.LOG_LEVEL != null ? parsedConfig.LOG_LEVEL : 'debug',
  httpPort: parsedConfig?.HTTP_PORT != null ? Number(parsedConfig.HTTP_PORT) : 3000,
  httpHostname: parsedConfig?.HTTP_HOSTNAME != null ? parsedConfig.HTTP_HOSTNAME : 'http://localhost',
  ari: {
    host: parsedConfig?.ARI_HOST != null ? parsedConfig.ARI_HOST : 'localhost',
    protocol: parsedConfig?.ARI_PROTOCOL != null ? parsedConfig.ARI_PROTOCOL : 'http',
    port: parsedConfig?.ARI_PORT != null ? Number(parsedConfig.ARI_PORT) : 8088,
    username: parsedConfig?.ARI_USERNAME != null ? parsedConfig.ARI_USERNAME : 'username',
    password: parsedConfig?.ARI_PASSWORD != null ? parsedConfig.ARI_PASSWORD : 'password',
    app: parsedConfig?.ARI_APP_NAME != null ? parsedConfig.ARI_APP_NAME : 'callout'
  }
};

export const ariUrl = `${config.ari.protocol}://${config.ari.host}:${config.ari.port}`;
