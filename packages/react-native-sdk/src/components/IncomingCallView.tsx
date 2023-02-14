import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { CallControlsButton } from './CallControlsButton';
import { useIncomingCalls } from '@stream-io/video-react-bindings';
import { UserInfoView } from './UserInfoView';
import {
  useStreamVideoStoreSetState,
  useStreamVideoStoreValue,
} from '../contexts';
import { useRingCall } from '../hooks';
import { Phone, PhoneDown, Video, VideoSlash } from '../icons';

/**
 * Props to be passed for the IncomingCallView component.
 */
interface IncomingCallViewProps {
  /**
   * Handler called when the call is answered. Mostly used for navigation and related actions.
   */
  onAnswerCall: () => void;
  /**
   * Handler called when the call is rejected. Mostly used for navigation and related actions.
   */
  onRejectCall: () => void;
}

export const IncomingCallView = (props: IncomingCallViewProps) => {
  const { onAnswerCall, onRejectCall } = props;
  const isVideoMuted = useStreamVideoStoreValue((store) => store.isVideoMuted);
  const setState = useStreamVideoStoreSetState();
  const { answerCall, rejectCall } = useRingCall();

  const videoToggle = async () => {
    setState((prevState) => ({
      isVideoMuted: !prevState.isVideoMuted,
    }));
  };

  const answerCallHandler = async () => {
    await answerCall();
    onAnswerCall();
  };

  const rejectCallHandler = async () => {
    await rejectCall();
    onRejectCall();
  };

  return (
    <Background>
      <UserInfoView />
      <Text style={styles.incomingCallText}>Incoming Call...</Text>
      <View style={styles.buttons}>
        <CallControlsButton
          onPress={rejectCallHandler}
          colorKey={'cancel'}
          style={styles.buttonStyle}
          svgContainerStyle={styles.svgStyle}
        >
          <PhoneDown color="#ffffff" />
        </CallControlsButton>
        <CallControlsButton
          onPress={videoToggle}
          colorKey={!isVideoMuted ? 'activated' : 'deactivated'}
          style={styles.buttonStyle}
          svgContainerStyle={styles.svgStyle}
        >
          {isVideoMuted ? (
            <VideoSlash color="#ffffff" />
          ) : (
            <Video color="#000000" />
          )}
        </CallControlsButton>
        <CallControlsButton
          onPress={answerCallHandler}
          colorKey={'callToAction'}
          style={styles.buttonStyle}
          svgContainerStyle={styles.svgStyle}
        >
          <Phone color="#ffffff" />
        </CallControlsButton>
      </View>
    </Background>
  );
};

const Background: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  const incomingCalls = useIncomingCalls();
  // FIXME OL: this needs to be reworked
  const lastIncomingCall =
    (incomingCalls.length && incomingCalls[incomingCalls.length - 1]) || null;
  const memberUserIds = Object.keys(lastIncomingCall?.users || {});

  if (memberUserIds.length)
    return (
      <ImageBackground
        blurRadius={10}
        source={{
          //FIXME: This is a temporary solution to get a random image for the background. Replace with image from coordinator
          uri: `https://getstream.io/random_png/?id=${memberUserIds[0]}&name=${memberUserIds[0]}`,
        }}
        style={StyleSheet.absoluteFill}
      >
        {children}
      </ImageBackground>
    );
  return (
    <View style={[StyleSheet.absoluteFill, styles.background]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#272A30',
  },
  incomingCallText: {
    marginTop: 16,
    fontSize: 20,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '600',
    opacity: 0.6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: '40%',
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
  },
  buttonStyle: {
    height: 70,
    width: 70,
    borderRadius: 70,
  },
  svgStyle: {
    height: 30,
    width: 30,
  },
});
