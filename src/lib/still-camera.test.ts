import * as fs from 'fs';
import { performance } from 'perf_hooks';
import { ImageEffectMode } from '..';

import StillCamera from './still-camera';

const TEST_IMAGES_DIR = 'test_images';

if (!fs.existsSync(TEST_IMAGES_DIR)) {
  fs.mkdirSync(TEST_IMAGES_DIR);
}

test('takeImage() returns JPEG', async () => {
  const t0 = performance.now();

  const stillCamera = new StillCamera({
    imageEffectMode: ImageEffectMode.Sketch,

    // 2X zoom
    roi: [0.25, 0.25, 0.5, 0.5],

    // Size 50 black text on white background
    annotateExtra: [50, '0x00', '0x8080FF'],

    // Custom text and Date/Time
    annotate: [4, 'pi-camera-connect %Y-%m-%d %X'],

    exif: {
      'IFD0.Artist': 'pi-camera-connect',
      'IFD0.ImageDescription': 'This is a custom description',
    },
  });

  const jpegImage = await stillCamera.takeImage();
  const t1 = performance.now();

  const time = ((t1 - t0) / 1000).toFixed(2);
  await fs.promises.writeFile(`test_images/stillCapture_(${time}-secs).jpeg`, jpegImage, 'binary');

  expect(jpegImage.indexOf(StillCamera.jpegSignature)).toBe(0);
});
