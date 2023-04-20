import { useEffect } from 'react';
import {
  CallingState,
  CopyToClipboardButtonWithPopup,
  DeviceSettings,
  IconButton,
  LoadingIndicator,
  Notification,
  useActiveCall,
  useCallCallingState,
} from '@stream-io/video-react-sdk';
import { CallHeaderTitle } from './CallHeaderTitle';
import { CallRecordings } from './CallRecordings';
import { USAGE_GUIDE_LINK } from './index';
import { IconInviteLinkButton } from './InviteLinkButton';
import { LayoutSelector, LayoutSelectorProps } from './LayoutSelector';

export const ActiveCallHeader = ({
  selectedLayout,
  onMenuItemClick: setLayout,
}: LayoutSelectorProps) => {
  const activeCall = useActiveCall();

  const callingState = useCallCallingState();
  const isOffline = callingState === CallingState.OFFLINE;
  const hasFailedToRecover = callingState === CallingState.RECONNECTING_FAILED;
  const isRecoveringConnection = [
    CallingState.JOINING,
    CallingState.RECONNECTING,
  ].includes(callingState);

  useEffect(() => {
    activeCall?.queryRecordings().catch((e) => {
      console.error('Failed to query recordings', e);
    });
  }, [activeCall]);

  return (
    <>
      <div className="str-video__call-header">
        <CallHeaderTitle />
        <div className="str-video__call-header__controls-group">
          <LayoutSelector
            selectedLayout={selectedLayout}
            onMenuItemClick={setLayout}
          />
          <IconButton
            icon="info-document"
            title="Usage guide and known limitations"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.open(USAGE_GUIDE_LINK, '_blank', 'noopener,noreferrer');
              }
            }}
          />
          <CopyToClipboardButtonWithPopup
            Button={IconInviteLinkButton}
            copyValue={
              typeof window !== 'undefined' ? window.location.href : ''
            }
          />
          <CallRecordings />
          <DeviceSettings />
        </div>
      </div>
      <div className="str-video__call-header__notifications">
        {(() => {
          if (isOffline || hasFailedToRecover) {
            return (
              <Notification
                isVisible
                placement="auto"
                message={
                  isOffline
                    ? 'You are offline. Check your internet connection and try again later.'
                    : 'Failed to restore connection. Check your internet connection and try again later.'
                }
              >
                <span />
              </Notification>
            );
          }

          return (
            <Notification
              isVisible={isRecoveringConnection}
              iconClassName={null}
              placement="auto"
              message={<LoadingIndicator text="Reconnecting..." />}
            >
              <span />
            </Notification>
          );
        })()}
      </div>
    </>
  );
};
