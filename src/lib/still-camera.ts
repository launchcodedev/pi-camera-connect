import {
  AwbMode,
  DynamicRange,
  ExposureMode,
  FlickerMode,
  Flip,
  ImageEffectMode,
  MeteringMode,
  Rotation,
} from '..';
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
  awbGains?: [number, number];
  analogGain?: number;
  digitalGain?: number;
  imageEffectMode?: ImageEffectMode;
  colorEffect?: [number, number]; // U,V
  dynamicRange?: DynamicRange;
  videoStabilization?: boolean;
  raw?: boolean;
  quality?: number;
  statistics?: boolean;
  thumbnail?: [number, number, number] | false; // X, Y, Q
  meteringMode?: MeteringMode;
  flickerMode?: FlickerMode;
  burst?: boolean;
  roi?: [number, number, number, number]; // X, Y, W, H
  exif?: { [key: string]: string | number } | false;
  gpsExif?: boolean;
  annotate?: (number | string)[];
  annotateExtra?: [number, string, string]; // fontSize, fontColor, backgroundColor
}

export default class StillCamera {
  private readonly options: StillOptions;

  static readonly jpegSignature = Buffer.from([0xff, 0xd8, 0xff, 0xe1]);

  constructor(options: StillOptions = {}) {
    this.options = {
      rotation: Rotation.Rotate0,
      flip: Flip.None,
      delay: 1,
      ...options,
    };
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
         * RAW (Save Bayer Data)
         * This option inserts the raw Bayer data from the camera in to the
         * JPEG metadata.
         */
        ...(this.options.raw ? ['--raw'] : []),

        /**
         * JPEG Quality
         * Quality 100 is almost completely uncompressed. 75 is a good allround value.
         */
        ...(this.options.quality ? ['--quality', this.options.quality.toString()] : []),

        /**
         * Burst
         * This prevents the camera from returning to preview mode in between captures,
         * meaning that captures can be taken closer together.
         */
        ...(this.options.burst ? ['--burst'] : []),

        /**
         * Thumbnail Settings (x:y:quality)
         * Allows specification of the thumbnail image inserted in to the JPEG file.
         * If not specified, defaults are a size of 64x48 at quality 35.
         * `false` will remove the default thumbnail
         */
        ...(Array.isArray(this.options.thumbnail) || this.options.thumbnail === false
          ? ['--thumb', !this.options.thumbnail ? 'none' : this.options.thumbnail.join(':')]
          : []),

        /**
         * Exif information
         * Allows the insertion of specific EXIF tags into the JPEG image.
         * You can have up to 32 EXIF tag entries.
         * Will overwrite any EXIF tag set automatically by the camera.
         */
        ...(this.options.exif
          ? Object.keys(this.options.exif).flatMap(
              key =>
                ['--exif', `${key}=${(this.options.exif as any)[key as keyof StillOptions['exif']]}`],
            )
          : []),
        // `false` will remove all the default EXIF information
        ...(this.options.exif === false ? ['--exif', 'none'] : []),

        /**
         * GPS Exif
         * Applies real-time EXIF information from any attached GPS dongle (using GSPD) to the image
         * (requires libgps.so to be installed)
         */
        ...(this.options.gpsExif ? ['--gpsexif'] : []),

        /**
         * Output to stdout
         */
        '--output',
        '-',
      ]);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(
          "Could not take image with StillCamera. Are you running on a Raspberry Pi with 'raspistill' installed?",
        );
      }

      throw err;
    }
  }
}
