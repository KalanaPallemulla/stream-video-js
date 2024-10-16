import { Observable } from 'rxjs';
import { Call } from '../Call';
import { CameraDirection, CameraManagerState } from './CameraManagerState';
import { InputMediaDeviceManager } from './InputMediaDeviceManager';
import { getVideoDevices, getVideoStream } from './devices';
import { TrackType } from '../gen/video/sfu/models/models';
import { PreferredCodec, PublishOptions } from '../types';
import { isMobile } from '../compatibility';

export class CameraManager extends InputMediaDeviceManager<CameraManagerState> {
  private targetResolution = {
    width: 1280,
    height: 720,
  };

  /**
   * The options to use when publishing the video stream.
   *
   * @internal
   */
  publishOptions: PublishOptions | undefined;

  /**
   * Constructs a new CameraManager.
   *
   * @param call the call instance.
   */
  constructor(call: Call) {
    super(call, new CameraManagerState(), TrackType.VIDEO);
  }

  /**
   * Select the camera direction.
   *
   * @param direction the direction of the camera to select.
   */
  async selectDirection(direction: Exclude<CameraDirection, undefined>) {
    if (isMobile()) {
      this.state.setDirection(direction);
      // Providing both device id and direction doesn't work, so we deselect the device
      this.state.setDevice(undefined);
      await this.applySettingsToStream();
    } else {
      this.logger('warn', 'Camera direction ignored for desktop devices');
    }
  }

  /**
   * Flips the camera direction: if it's front it will change to back, if it's back, it will change to front.
   *
   * Note: if there is no available camera with the desired direction, this method will do nothing.
   * @returns
   */
  async flip() {
    const newDirection = this.state.direction === 'front' ? 'back' : 'front';
    await this.selectDirection(newDirection);
  }

  /**
   * @internal
   */
  async selectTargetResolution(resolution: { width: number; height: number }) {
    this.targetResolution.height = resolution.height;
    this.targetResolution.width = resolution.width;
    if (this.state.optimisticStatus === 'enabled') {
      try {
        await this.statusChangeSettled();
      } catch (error) {
        // couldn't enable device, target resolution will be applied the next time user attempts to start the device
        this.logger('warn', 'could not apply target resolution', error);
      }
    }
    if (this.enabled) {
      const { width, height } = this.state
        .mediaStream!.getVideoTracks()[0]
        ?.getSettings();
      if (
        width !== this.targetResolution.width ||
        height !== this.targetResolution.height
      ) {
        await this.applySettingsToStream();
        this.logger(
          'debug',
          `${width}x${height} target resolution applied to media stream`,
        );
      }
    }
  }

  /**
   * Sets the preferred codec for encoding the video.
   *
   * @internal internal use only, not part of the public API.
   * @param codec the codec to use for encoding the video.
   */
  setPreferredCodec(codec: PreferredCodec | undefined) {
    this.updatePublishOptions({ preferredCodec: codec });
  }

  /**
   * Updates the preferred publish options for the video stream.
   *
   * @internal
   * @param options the options to use.
   */
  updatePublishOptions(options: PublishOptions) {
    this.publishOptions = { ...this.publishOptions, ...options };
  }

  /**
   * Returns the capture resolution of the camera.
   */
  getCaptureResolution() {
    const { mediaStream } = this.state;
    if (!mediaStream) return;

    const [videoTrack] = mediaStream.getVideoTracks();
    if (!videoTrack) return;

    const settings = videoTrack.getSettings();
    return {
      width: settings.width,
      height: settings.height,
      frameRate: settings.frameRate,
    };
  }

  protected getDevices(): Observable<MediaDeviceInfo[]> {
    return getVideoDevices();
  }

  protected getStream(
    constraints: MediaTrackConstraints,
  ): Promise<MediaStream> {
    constraints.width = this.targetResolution.width;
    constraints.height = this.targetResolution.height;
    // We can't set both device id and facing mode
    // Device id has higher priority
    if (!constraints.deviceId && this.state.direction && isMobile()) {
      constraints.facingMode =
        this.state.direction === 'front' ? 'user' : 'environment';
    }
    return getVideoStream(constraints);
  }

  protected publishStream(stream: MediaStream): Promise<void> {
    return this.call.publishVideoStream(stream, this.publishOptions);
  }

  protected stopPublishStream(stopTracks: boolean): Promise<void> {
    return this.call.stopPublish(TrackType.VIDEO, stopTracks);
  }
}
