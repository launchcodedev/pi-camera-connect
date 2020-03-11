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
