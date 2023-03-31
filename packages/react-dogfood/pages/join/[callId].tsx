import { useEffect } from 'react';
import Gleap from 'gleap';
import { useRouter } from 'next/router';
import {
  Call,
  MediaDevicesProvider,
  StreamVideo,
  useCreateStreamVideoClient,
} from '@stream-io/video-react-sdk';
import Head from 'next/head';

import { useCreateStreamChatClient } from '../../hooks';
import { LoadingScreen, MeetingUI } from '../../components';
import { getDeviceSettings } from '../../components/DeviceSettingsCaptor';
import {
  getServerSideCredentialsProps,
  ServerSideCredentialsProps,
} from '../../lib/getServerSideCredentialsProps';

const CallRoom = (props: ServerSideCredentialsProps) => {
  const router = useRouter();
  const callId = router.query['callId'] as string;

  const { userToken, user, apiKey, gleapApiKey } = props;

  const client = useCreateStreamVideoClient({
    apiKey,
    tokenOrProvider: userToken,
    user,
  });

  const chatClient = useCreateStreamChatClient({
    apiKey,
    tokenOrProvider: userToken,
    userData: user,
  });

  useEffect(() => {
    if (gleapApiKey) {
      Gleap.initialize(gleapApiKey);
      Gleap.identify(user.name || user.id, {
        name: user.name,
      });
    }
  }, [gleapApiKey, user.name, user.id]);

  useEffect(() => {
    if (!gleapApiKey) return;

    Gleap.on('flow-started', () => {
      try {
        const { getCurrentValue, ...state } = client.readOnlyStateStore;
        const data = Object.entries(state).reduce<Record<string, any>>(
          (acc, [key, observable]) => {
            if (!!observable && typeof observable.subscribe === 'function') {
              const value = getCurrentValue<unknown>(observable);
              if (key === 'activeCall$' && value) {
                // special handling, the Call instance isn't serializable
                const call = value as Call;
                acc[key] = call.state.getCurrentValue(call.state.metadata$);
              } else {
                acc[key] = value;
              }
            }
            return acc;
          },
          {},
        );
        console.log('!!State Store', data);
        Gleap.attachCustomData(data);
      } catch (e) {
        console.error(e);
      }
    });
  }, [client.readOnlyStateStore, gleapApiKey]);

  const deviceSettings = getDeviceSettings();

  if (!client) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ flexGrow: 1, minHeight: 0 }}>
      <Head>
        <title>Stream Calls: {callId}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <StreamVideo client={client}>
        <MediaDevicesProvider
          enumerate
          initialAudioEnabled={!deviceSettings?.isAudioMute}
          initialVideoEnabled={!deviceSettings?.isVideoMute}
          initialVideoInputDeviceId={deviceSettings?.selectedVideoDeviceId}
          initialAudioInputDeviceId={deviceSettings?.selectedAudioInputDeviceId}
          initialAudioOutputDeviceId={
            deviceSettings?.selectedAudioOutputDeviceId
          }
        >
          <MeetingUI chatClient={chatClient} />
        </MediaDevicesProvider>
      </StreamVideo>
    </div>
  );
};

export default CallRoom;

export const getServerSideProps = getServerSideCredentialsProps;
