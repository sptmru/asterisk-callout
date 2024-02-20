import { AriData } from '../domain/types/aridata.type';
import { logger } from '../misc/Logger';
import { PhoneNumberWithSound } from '../domain/types/phonenumberwithsound.type';
import { Channel, LiveRecording, Playback } from 'ari-client';

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

  static async playSound(ariData: AriData, sound: string): Promise<Playback> {
    const { client, channel } = ariData;
    const playback = client.Playback();
    await channel.play({ media: `sound:${sound}` }, playback);
    logger.debug(`Playback started on channel ${channel.id}`);

    return playback;
  }

  static async initiateBulkPlaybackCalls(ariData: AriData, numbersWithSound: PhoneNumberWithSound[]): Promise<void> {
    for (const phoneNumberWithSound of numbersWithSound) {
      this.initiatePlaybackCall(ariData, phoneNumberWithSound).then();
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
      logger.error(`Failed to call PJSIP/${phoneNumberWithSound.number}: ${err}`);
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
}
