import * as si from 'systeminformation';
import { Flip, Rotation } from '..';
import { spawnPromise } from '../util';

export interface StillOptions {
  width?: number;
  height?: number;
  rotation?: Rotation;
  flip?: Flip;
  delay?: number;
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
         * Width
         */
        ...(this.options.width ? ['--width', this.options.width.toString()] : []),

        /**
         * Height
         */
        ...(this.options.height ? ['--height', this.options.height.toString()] : []),

        /**
         * Rotation
         */
        ...(this.options.rotation ? ['--rotation', this.options.rotation.toString()] : []),

        /**
         * Horizontal flip
         */
        ...(this.options.flip &&
        (this.options.flip === Flip.Horizontal || this.options.flip === Flip.Both)
          ? ['--hflip']
          : []),

        /**
         * Vertical flip
         */
        ...(this.options.flip &&
        (this.options.flip === Flip.Vertical || this.options.flip === Flip.Both)
          ? ['--vflip']
          : []),

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
