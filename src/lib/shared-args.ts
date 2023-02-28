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
     * ISO (100 to 800)
     */
    ...(options.iso ? ['--ISO', options.iso.toString()] : []),

    /**
     * EV Compensation (-10 to 10; default 0)
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
     * Sets the blue and red channel gains if awbMode is Off
     */
    ...(options.awbGains ? ['--awbgains', options.awbGains.toString()] : []),

    /**
     * Analog Gain
     * Sets the analog gain value directly on the sensor (floating point value from
     * 1.0 to 8.0 for the OV5647 sensor on Camera Module V1, and 1.0 to 12.0 for the
     * IMX219 sensor on Camera Module V2 and the IMX447 on the HQ Camera).
     */
    ...(options.analogGain ? ['--analoggain', options.analogGain.toString()] : []),

    /**
     * Digital Gain
     * Sets the digital gain value applied by the ISP
     * (floating point value from 1.0 to 64.0,
     * but values over about 4.0 willproduce overexposed images)
     */
    ...(options.digitalGain ? ['--digitalgain', options.digitalGain.toString()] : []),

    /**
     * Image Effect
     */
    ...(options.imageEffectMode ? ['--imxfx', options.imageEffectMode.toString()] : []),

    /**
     * Dynamic Range Control
     */
    ...(options.dynamicRange ? ['--drc', options.dynamicRange] : []),

    /**
     * Color Effects
     * The supplied U and V parameters (range 0 to 255) are applied to
     * the U and Y channels of the image. For example, --colfx 128:128
     * should result in a monochrome image.
     */
    ...(options.colorEffect ? ['--colfx', options.colorEffect.join(':')] : []),

    /**
     * Metering
     * Specify the metering mode used for the preview and capture.
     */
    ...(options.meteringMode ? ['--metering', options.meteringMode] : []),

    /**
     * Flicker Avoid Mode
     * Set a mode to compensate for lights flickering at the mains frequency,
     * which can be seen as a dark horizontal band across an image.
     * Flicker avoidance locks the exposure time to a multiple of the mains
     * flicker frequency (8.33ms for 60Hz, or 10ms for 50Hz).
     * This means that images can be noisier as the control algorithm has to
     * increase the gain instead of exposure time should it wish for an
     * intermediate exposure value. auto can be confused by external factors,
     * therefore it is preferable to leave this setting off unless actually required.
     */
    ...(options.flickerMode ? ['--flicker', options.flickerMode] : []),

    /**
     * Video Stabilization
     * In video mode only, turn on video stabilization.
     */
    ...(options.videoStabilization ? ['--vstab'] : []),

    /**
     * Statistics
     * Force recomputation of statistics on stills capture pass. Digital gain and AWB are
     * recomputed based on the actual capture frame statistics,
     * rather than the preceding preview frame.
     */
    ...(options.statistics ? ['--stats'] : []),

    /**
     * Sensor region of interest
     * Allows the specification of the area of the sensor to be used as
     * the source for the preview and capture. This is defined as x,y for
     * the top left corner, and a width and height, all values in
     * normalised coordinates (0.0-1.0).
     */
    ...(options.roi ? ['--roi', options.roi.toString()] : []),

    /**
     * Annotate
     * Adds some text and/or metadata to the picture.
     */
    ...(options.annotate ? options.annotate.flatMap(e => ['--annotate', e.toString()]) : []),

    /**
     * Annotate extra
     * Specifies annotation size, text colour, and background color.
     * Colors are in hex YUV format. Size ranges from 6 - 160; default is 32
     */
    ...(options.annotateExtra ? ['--annotateex', options.annotateExtra.toString()] : []),
  ];
}
