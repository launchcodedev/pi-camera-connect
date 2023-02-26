export { default as StillCamera, StillOptions } from './lib/still-camera';
export { default as StreamCamera, StreamOptions, Codec, SensorMode } from './lib/stream-camera';

export enum Rotation {
  Rotate0 = 0,
  Rotate90 = 90,
  Rotate180 = 180,
  Rotate270 = 270,
}

export enum Flip {
  None = 'none',
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Both = 'both',
}

export enum ExposureMode {
  Off = 'off',
  Auto = 'auto',
  Night = 'night',
  NightPreview = 'nightpreview',
  Backlight = 'backlight',
  Spotlight = 'spotlight',
  Sports = 'sports',
  Snow = 'snow',
  Beach = 'beach',
  VeryLong = 'verylong',
  FixedFps = 'fixedfps',
  AntiShake = 'antishake',
  Fireworks = 'fireworks',
}

export enum AwbMode {
  Off = 'off',
  Auto = 'auto',
  Sun = 'sun',
  Cloud = 'cloud',
  Shade = 'shade',
  Tungsten = 'tungsten',
  Fluorescent = 'fluorescent',
  Incandescent = 'incandescent',
  Flash = 'flash',
  Horizon = 'horizon',
  GreyWorld = 'greyworld',
}

export enum ImageEffectMode {
  None = 'none',
  Negative = 'negative',
  Solarise = 'solarise',
  Sketch = 'sketch',
  Denoise = 'denoise',
  Emboss = 'emboss',
  OilPaint = 'oilpaint',
  Hatch = 'hatch',
  GPen = 'gpen',
  Pastel = 'pastel',
  Watercolour = 'watercolour',
  Film = 'film',
  Blur = 'blur',
  Saturation = 'saturation',
  ColourSwap = 'colourswap',
  WashedOut = 'washedout',
  Posterise = 'posterise',
  ColourPoint = 'colourpoint',
  ColourBalance = 'colourbalance',
  Cartoon = 'cartoon',
}

export enum DynamicRange {
  Off = 'off',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export enum MeteringMode {
  Average = 'average',
  Spot = 'spot',
  Backlit = 'backlit',
  Matrix = 'matrix',
}

export enum FlickerMode {
  Off = 'off',
  Auto = 'auto',
  Frq50hz = '50hz',
  Frq60Hz = '60hz',
}
