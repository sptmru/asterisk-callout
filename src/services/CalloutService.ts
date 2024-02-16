import { AriData } from '../types/AriData';
import { logger } from '../misc/Logger';
import { PhoneNumberWithSound } from '../types/ListOfNumbers';

export class CalloutService {
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

      const recordingOptions = {
        channelId: outgoingChannel.id,
        name: `${phoneNumberWithSound.number}_${Date.now()}`,
        format: 'wav', // Specify the recording format
        maxDurationSeconds: 0, // Optional - Use 0 for no limit
        maxSilenceSeconds: 0, // Optional - Use 0 for no limit
        ifExists: 'overwrite' // Optional - Overwrites the file if it exists
      };

      outgoingChannel.answer(async () => {
        logger.debug(`External channel ${outgoingChannel.id} answered`);

        client.channels.snoopChannelWithId(
          {
            channelId: outgoingChannel.id,
            snoopId: `${outgoingChannel.id}_snoop`,
            spy: 'both',
            app: appName as string
          },
          (_err, snoopChannel) => {
            const liveRecording = client.LiveRecording();
            snoopChannel.record(recordingOptions, liveRecording);
            logger.debug(`Recording started on channel ${outgoingChannel.id}`);
          }
        );

        const playback = client.Playback();
        await outgoingChannel.play({ media: `sound:${phoneNumberWithSound.sound}` }, playback);
        logger.debug(`Playback started on channel ${outgoingChannel.id}`);

        playback.once('PlaybackFinished', async () => {
          logger.debug(`Playback finished on channel ${outgoingChannel.id}, hangup`);
          await outgoingChannel.hangup();
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
}
