import StillCamera from './still-camera';

test('takeImage() returns JPEG', async () => {
  const stillCamera = new StillCamera();

  const jpegImage = await stillCamera.takeImage();

  expect(jpegImage.indexOf(await StillCamera.getJpegSignature())).toBe(0);
});
