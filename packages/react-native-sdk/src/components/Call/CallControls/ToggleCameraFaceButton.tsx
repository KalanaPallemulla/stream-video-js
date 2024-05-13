import { OwnCapability } from '@stream-io/video-client';
import { Restricted, useCallStateHooks } from '@stream-io/video-react-bindings';
import React from 'react';
import { CallControlsButton } from './CallControlsButton';
import { CameraSwitch } from '../../../icons';
import { useTheme } from '../../../contexts/ThemeContext';

/**
 * Props for the Toggle Camera face button.
 */
export type ToggleCameraFaceButtonProps = {
  /**
   * Handler to be called when the the video publishing button is pressed.
   * @returns void
   */
  onPressHandler?: () => void;
};

/**
 * Button to toggle camera face(front/back) when in the call.
 */
export const ToggleCameraFaceButton = ({
  onPressHandler,
}: ToggleCameraFaceButtonProps) => {
  const { useCameraState, useCallSettings } = useCallStateHooks();
  const { camera, isMute, direction } = useCameraState();
  const callSettings = useCallSettings();
  const isVideoEnabledInCall = callSettings?.video.enabled;

  const {
    theme: { colors, toggleCameraFaceButton },
  } = useTheme();
  const onPress = async () => {
    if (onPressHandler) {
      onPressHandler();
      return;
    }

    await camera.flip();
  };

  if (!isVideoEnabledInCall) {
    return;
  }

  return (
    <Restricted requiredGrants={[OwnCapability.SEND_VIDEO]}>
      <CallControlsButton
        onPress={onPress}
        color={direction === 'back' ? colors.overlay_dark : colors.static_white}
        disabled={isMute}
        style={toggleCameraFaceButton}
      >
        <CameraSwitch
          color={
            direction === 'front' || direction === undefined
              ? colors.static_black
              : colors.static_white
          }
        />
      </CallControlsButton>
    </Restricted>
  );
};
