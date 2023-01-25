import { StillOptions } from './still-camera';
import { StreamOptions } from './stream-camera';
import { Flip } from '..';

/**
 * Get the command line arguments for `raspistill` or `raspivid` that are common among both
 *
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
    ...(options.flip && (options.flip === Flip.Horizontal || options.flip === Flip.Both)
      ? ['--hflip']
      : []),

    /**
     * Vertical flip
     */
    ...(options.flip && (options.flip === Flip.Vertical || options.flip === Flip.Both)
      ? ['--vflip']
      : []),

    /**
     * Shutter Speed
     */
    ...(options.shutter ? ['--shutter', options.shutter.toString()] : []),

    /**
     * Sharpness (-100 to 100; default 0)
     */
    ...(options.sharpness ? ['--sharpness', options.sharpness.toString()] : []),

    /**
     * Contrast (-100 to 100; default 0)
     */
    ...(options.contrast ? ['--contrast', options.contrast.toString()] : []),

    /**
     * Brightness (0 to 100; default 50)
     */
    ...(options.brightness || options.brightness === 0
      ? ['--brightness', options.brightness.toString()]
      : []),

    /**
     * Saturation (-100 to 100; default 0)
     */
    ...(options.saturation ? ['--saturation', options.saturation.toString()] : []),

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
    ...(options.digitalGain ? ['--digitalgain', options.digitalGain.toString()] : []),

    /**
     * Image Effect
     */
    ...(options.imageEffect ? ['--imxfx', options.imageEffect.toString()] : []),

    /**
     * Dynamic Range Control
     */
    ...(options.dynamicRange ? ['--drc', options.dynamicRange] : []),

    /**
     * Colour Effects
     */
    ...(options.colourEffect ? ['--colfx', options.colourEffect.join(':')] : []),

    /**
     * Video Stabilisation
     */
    ...(options.videoStabilisation ? ['--vstab'] : []),
  ];
}