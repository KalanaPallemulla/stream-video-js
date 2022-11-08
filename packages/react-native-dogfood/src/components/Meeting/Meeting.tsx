import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Switch,
  Button,
  Linking,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useCall } from '../../hooks/useCall';
import {
  useAppGlobalStoreSetState,
  useAppGlobalStoreValue,
} from '../../contexts/AppContext';
import { mediaDevices } from 'react-native-webrtc';
import { meetingId } from '../../modules/helpers/meetingId';

const APP_ID = 'streamrnvideosample';

const Meeting = () => {
  const callID = useAppGlobalStoreValue((store) => store.callID);
  const loopbackMyVideo = useAppGlobalStoreValue(
    (store) => store.loopbackMyVideo,
  );
  const setState = useAppGlobalStoreSetState();

  // run only once per app lifecycle
  useEffect(() => {
    const parseAndSetCallID = (url: string | null) => {
      const matchResponse = url?.match(/.*callID\/(.*)\//);
      if (!matchResponse || matchResponse.length < 1) {
        return null;
      }

      setState({
        callID: matchResponse[1],
      });
    };
    // listen to url changes and parse the callID
    const { remove } = Linking.addEventListener('url', ({ url }) => {
      parseAndSetCallID(url);
    });
    const configure = async () => {
      const mediaStream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setState({
        localMediaStream: mediaStream,
      });
      const url = await Linking.getInitialURL();
      parseAndSetCallID(url);
    };

    configure();
    return remove;
  }, [setState]);

  const { getOrCreateCall } = useCall({
    callId: callID,
    callType: 'default', // TODO: SANTHOSH -- what is this?
    autoJoin: true,
  });

  const handleCopyInviteLink = useCallback(
    () => Clipboard.setString(`${APP_ID}://callID/${callID}/`),
    [callID],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{'Whats the call ID?'}</Text>
        <Button
          title={'Randomise'}
          color="blue"
          onPress={() => {
            setState({ callID: meetingId(5) });
          }}
        />
      </View>
      <TextInput
        style={styles.textInput}
        placeholder={'Type your call ID here...'}
        placeholderTextColor={'#8C8C8CFF'}
        value={callID}
        onChangeText={(text) => setState({ callID: text.trim() })}
      />
      <Button
        title={'Create or Join call with callID: ' + callID}
        color="blue"
        disabled={!callID}
        onPress={getOrCreateCall}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.loopbackText}>Loopback my video(Debug Mode)</Text>
        <Switch
          value={loopbackMyVideo}
          onChange={() => {
            setState((prevState) => ({
              loopbackMyVideo: !prevState.loopbackMyVideo,
            }));
          }}
        />
      </View>
      <Button
        title="Copy Invite Link"
        color="blue"
        onPress={handleCopyInviteLink}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  textInput: {
    color: '#000',
    height: 40,
    width: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 10,
    marginVertical: 8,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'black',
    fontSize: 20,
    marginVertical: 8,
  },
  loopbackText: {
    color: 'black',
  },
});

export default Meeting;
