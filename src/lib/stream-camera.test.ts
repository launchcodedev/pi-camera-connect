import StreamCamera, { Codec } from "./stream-camera";

test("takeImage() grabs JPEG from MJPEG stream", async () => {

	const streamCamera = new StreamCamera({
		codec: Codec.MJPEG
	});

	await streamCamera.startCapture();

	const jpegImage = await streamCamera.takeImage();

	await streamCamera.stopCapture();

	expect(jpegImage.indexOf(StreamCamera.jpegSignature)).toBe(0);
});
