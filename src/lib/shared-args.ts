import { StillOptions } from "./still-camera";
import { StreamOptions } from "./stream-camera";
import { Flip } from '..';

/**
 * Get the command line arguments for `raspistill` or `raspivid` that are common among both
 *
 * These are: `--width`, `--height`, `--rotation`, `--hflip`, `--vflip`, `--shutter`,
 * `--ISO`, `--exposure`, `--ev`, and `--awb`
 * @param options Camera options
 */
export function getSharedArgs(options: StillOptions | StreamOptions): string[] {
  return [

    /**
     * Width
     */
    ...(options.width ? ['--width', options.width.toString()] : []),

    /**
     * Height
     */
    ...(options.height ? ['--height', options.height.toString()] : []),

    /**
     * Rotation
     */
    ...(options.rotation ? ['--rotation', options.rotation.toString()] : []),

    /**
     * Horizontal flip
     */
    ...(options.flip &&
    (options.flip === Flip.Horizontal || options.flip === Flip.Both)
      ? ['--hflip']
      : []),

    /**
     * Vertical flip
     */
    ...(options.flip &&
    (options.flip === Flip.Vertical || options.flip === Flip.Both)
      ? ['--vflip']
      : []),

    /**
     * Shutter Speed
     */
    ...(options.shutter ? ["--shutter", options.shutter.toString()] : []),

    /**
     * ISO
     */
    ...(options.iso ? ['--ISO', options.iso.toString()] : []),

    /**
     * EV Compensation
     */
    ...(options.exposureCompensation ? ['--ev', options.exposureCompensation.toString()] : []),

    /**
     * Exposure Mode
     */
    ...(options.exposureMode ? ['--exposure', options.exposureMode.toString()] : []),

    /**
     * Auto White Balance Mode
     */
    ...(options.awbMode ? ['--awb', options.awbMode.toString()] : []),

    /**
     * Analog Gain
     */
    ...(options.analogGain ? ['--analoggain', options.analogGain.toString()] : []),

    /**
     * Digital Gain
     */
    ...(options.digitalGain ? ['--digitalgain', options.digitalGain.toString()] : [])
  ];
}
