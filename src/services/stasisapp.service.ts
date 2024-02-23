import { Channel, Client } from 'ari-client';
import { logger } from '../misc/Logger';

export class StasisAppService {
  static async startStasisApp(client: Client, appName: string): Promise<void> {
    logger.debug(`Starting Stasis app ${appName}...`);
    try {
      return await client.start(appName);
    } catch (err) {
      logger.error(`Failed to start Stasis app ${appName}: ${err.message}`);
      throw err;
    }
  }

  static async moveChannelToStasisApp(channel: Channel, appName: string, appArgs: string = ''): Promise<void> {
    logger.debug(`Moving channel ${channel.id} to Stasis app ${appName}...`);
    try {
      return await channel.move({ app: appName, appArgs });
    } catch (err) {
      logger.error(`Failed to move channel ${channel.id} to Stasis app ${appName}: ${err.message}`);
      throw err;
    }
  }
}
