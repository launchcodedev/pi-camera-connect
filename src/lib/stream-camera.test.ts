import StreamCamera, { Codec } from './stream-camera';

test('Method takeImage() grabs JPEG from MJPEG stream', async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
  });

  await streamCamera.startCapture();

  const jpegImage = await streamCamera.takeImage();

  await streamCamera.stopCapture();

  expect(jpegImage.indexOf(StreamCamera.jpegSignature)).toBe(0);
});

test('Method createStream() returns a stream of video data', async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
  });

  await streamCamera.startCapture();

  const videoStream = streamCamera.createStream();

  // Wait 300 ms for data to arrive
  await new Promise(resolve => setTimeout(() => resolve(), 300));

  const data = videoStream.read();

  await streamCamera.stopCapture();

  expect(data).not.toBeNull();
  expect(data.length).toBeGreaterThan(0);
});

test('StreamCamera can push to multiple streams', async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
  });

  await streamCamera.startCapture();

  const videoStream1 = streamCamera.createStream();
  const videoStream2 = streamCamera.createStream();

  // Wait 300 ms for data to arrive
  await new Promise(resolve => setTimeout(() => resolve(), 300));

  const data1 = videoStream1.read();
  const data2 = videoStream2.read();

  await streamCamera.stopCapture();

  expect(data1).not.toBeNull();
  expect(data1.length).toBeGreaterThan(0);

  expect(data2).not.toBeNull();
  expect(data2.length).toBeGreaterThan(0);
});

test('Method stopCapture() ends all streams', async () => {
  const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
  });

  await streamCamera.startCapture();

  const videoStream1 = streamCamera.createStream();
  const videoStream2 = streamCamera.createStream();

  // Readable streams will only call "end" when all data has been read
  // Calling resume() turns on flowing mode, which auto-reads data as it arrives
  videoStream1.resume();
  videoStream2.resume();

  const stream1EndPromise = new Promise(resolve => videoStream1.on('end', () => resolve()));
  const stream2EndPromise = new Promise(resolve => videoStream2.on('end', () => resolve()));

  await streamCamera.stopCapture();

  return Promise.all([
    expect(stream1EndPromise).resolves.toBeUndefined(),
    expect(stream2EndPromise).resolves.toBeUndefined(),
  ]);
});
