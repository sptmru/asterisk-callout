import { AriData } from '../domain/types/aridata.type';
import { logger } from '../misc/Logger';
import { PhoneNumberWithSound } from '../domain/types/phonenumberwithsound.type';
import { Channel, LiveRecording, Playback } from 'ari-client';
import { ExtensionsService } from './ExtensionsService';
import { ExtensionStatusEnum } from '../domain/enums/extensionstatus.enum';

export class CalloutService {
  static async createRecordingSnoopChannel(ariData: AriData, recordingNumber: string): Promise<LiveRecording> {
    const { client, channel, appName } = ariData;
    const recordingOptions = {
      channelId: channel.id,
      name: `${recordingNumber}_${Date.now()}`,
      format: 'wav',
      maxDurationSeconds: 0,
      maxSilenceSeconds: 0,
      ifExists: 'overwrite'
    };

    const snoopChannel = await client.channels.snoopChannelWithId({
      channelId: channel.id,
      snoopId: `${channel.id}_snoop`,
      spy: 'both',
      app: appName as string
    });

    const liveRecording = client.LiveRecording();
    await snoopChannel.record(recordingOptions, liveRecording);
    logger.debug(`Recording started on channel ${channel.id}`);

    return liveRecording;
  }

  static async playSound(ariData: AriData, sound: string, playbackOrNull: Playback | null = null): Promise<Playback> {
    const { client, channel } = ariData;

    const playback = playbackOrNull === null ? client.Playback() : playbackOrNull;

    try {
      await channel.play({ media: `sound:${sound}` }, playback);
      logger.debug(`Playback started on channel ${channel.id}`);
    } catch (err) {
      logger.debug(`Error while trying to play sound: ${err.message}`);
    }

    return playback;
  }

  static async initiateBulkPlaybackCalls(ariData: AriData, numbersWithSound: PhoneNumberWithSound[]): Promise<void> {
    for (const phoneNumberWithSound of numbersWithSound) {
      await this.initiatePlaybackCall(ariData, phoneNumberWithSound).then();
    }
  }

  static async initiatePlaybackCall(ariData: AriData, phoneNumberWithSound: PhoneNumberWithSound): Promise<void> {
    const { client, appName } = ariData;
    const outgoingChannel = client.Channel();

    outgoingChannel.once('ChannelDestroyed', () => {
      logger.debug(`External channel ${outgoingChannel.id} got ChannelDestroyed`);
    });

    outgoingChannel.once('StasisStart', () => {
      logger.debug(`External channel ${outgoingChannel.id} got StasisStart`);

      outgoingChannel.once('StasisEnd', () => {
        logger.debug(`External channel ${outgoingChannel.id} got StasisEnd`);
      });

      outgoingChannel.answer(async () => {
        logger.debug(`External channel ${outgoingChannel.id} answered`);

        const recording = await this.createRecordingSnoopChannel(
          { ...ariData, channel: outgoingChannel },
          phoneNumberWithSound.number
        );
        const playback = await this.playSound({ ...ariData, channel: outgoingChannel }, phoneNumberWithSound.sound);

        playback.once('PlaybackFinished', async () => {
          logger.debug(`Playback finished on channel ${outgoingChannel.id}, hangup`);
          await recording.stop();
          await this.hangupChannel(outgoingChannel);
        });
      });
    });

    try {
      await outgoingChannel.originate({
        endpoint: `PJSIP/${phoneNumberWithSound.number}`,
        app: appName,
        appArgs: 'dialed'
      });
      logger.debug(`Calling PJSIP/${phoneNumberWithSound.number} on channel ${outgoingChannel.id}`);
    } catch (err) {
      logger.error(`Failed to call PJSIP/${phoneNumberWithSound.number}: ${err.message}`);
    }
    return;
  }

  static async hangupChannel(channel: Channel): Promise<void> {
    try {
      await channel.hangup();
      logger.debug(`Hangup channel ${channel.id}`);
    } catch (err) {
      logger.debug(`Failed to hangup channel ${channel.id} — nothing to hangup`);
    }
  }

  static async startOperatorGroupCall(ariData: AriData, extensionNumbers: string[]): Promise<Channel[]> {
    const { client, appName: app } = ariData;

    const channels = await Promise.all(
      extensionNumbers.map(async endpoint => {
        const channel = client.Channel();
        const playback = client.Playback();

        channel.once('ChannelDestroyed', () => {
          logger.debug(`Got ChannelDestroyed on channel ${channel.id}`);
        });

        channel.once('StasisStart', () => {
          logger.debug(`Got StasisStart on channel ${channel.id}`);

          channel.once('StasisEnd', () => {
            logger.debug(`Got StasisEnd on channel ${channel.id}`);
          });

          channel.answer(async () => {
            logger.debug(`Channel ${channel.id} answered, playing demo-thanks...`);
            await this.playSound({ channel, client }, 'demo-thanks', playback);

            playback.on('PlaybackFinished', async () => {
              logger.debug(`Playback finished on channel ${channel.id}, repeating playback...`);
              await this.playSound({ channel, client }, 'demo-thanks', playback);
            });
          });
        });

        await channel.originate({
          endpoint,
          app,
          appArgs: 'dialed'
        });

        return channel;
      })
    );

    return channels;
  }

  static async callAllAvailableOperators(ariData): Promise<Channel[]> {
    const availableExtensions = await ExtensionsService.getExtensionsByStatus(ExtensionStatusEnum.AVAILABLE);
    return this.startOperatorGroupCall(
      ariData,
      availableExtensions.map(extension => `${extension.sip_driver}/${extension.extension_number}`)
    );
  }
}
