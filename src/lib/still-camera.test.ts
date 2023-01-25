import * as fs from 'fs';
import { performance } from 'perf_hooks';

import StillCamera from './still-camera';

const TEST_IMAGES_DIR = 'test_images';

if (!fs.existsSync(TEST_IMAGES_DIR)) {
  fs.mkdirSync(TEST_IMAGES_DIR);
}

test('takeImage() returns JPEG', async () => {

  const t0 = performance.now();

  const stillCamera = new StillCamera();

  const jpegImage = await stillCamera.takeImage();
  const t1 = performance.now();

  const time = ((t1 - t0) / 1000).toFixed(2);
  await fs.promises.writeFile(`test_images/stillCapture_(${time}-secs).jpeg`, jpegImage, 'binary');

  expect(jpegImage.indexOf(StillCamera.jpegSignature)).toBe(0);
});
