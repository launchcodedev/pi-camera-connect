import * as si from 'systeminformation';
import { AwbMode, ExposureMode, Flip, Rotation } from '..';
import { spawnPromise } from '../util';
import { getSharedArgs } from './shared-args';

export interface StillOptions {
  width?: number;
  height?: number;
  rotation?: Rotation;
  flip?: Flip;
  delay?: number;
  shutter?: number;
  sharpness?: number;
  contrast?: number;
  brightness?: number;
  saturation?: number;
  iso?: number;
  exposureCompensation?: number;
  exposureMode?: ExposureMode;
  awbMode?: AwbMode;
  analogGain?: number;
  digitalGain?: number;
}

export default class StillCamera {
  private readonly options: StillOptions;

  constructor(options: StillOptions = {}) {
    this.options = {
      rotation: Rotation.Rotate0,
      flip: Flip.None,
      delay: 1,
      ...options,
    };
  }

  static async getJpegSignature() {
    const systemInfo = await si.system();
    switch (systemInfo.model) {
      case 'BCM2711':
      case 'BCM2835 - Pi 3 Model B':
      case 'BCM2835 - Pi 3 Model B+':
      case 'BCM2835 - Pi 4 Model B':
      case 'BCM2835 - Pi Zero':
      case 'BCM2835 - Pi Zero W':
        return Buffer.from([0xff, 0xd8, 0xff, 0xe1]);
      default:
        throw new Error(
          `Could not determine JPEG signature. Unknown system model '${systemInfo.model}'`,
        );
    }
  }

  async takeImage() {
    try {
      return await spawnPromise('raspistill', [
        /**
         * Add the command-line arguments that are common to both `raspivid` and `raspistill`
         */
        ...getSharedArgs(this.options),

        /**
         * Capture delay (ms)
         */
        '--timeout',
        this.options.delay!.toString(),

        /**
         * Do not display preview overlay on screen
         */
        '--nopreview',

        /**
         * Output to stdout
         */
        '--output',
        '-',
      ]);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(
          "Could not take image with StillCamera. Are you running on a Raspberry Pi with 'raspistill' installed?",
        );
      }

      throw err;
    }
  }
}
