import StillCamera from "./still-camera";

test("takeImage() returns JPEG", async () => {

	const stillCamera = new StillCamera();

	const jpegImage = await stillCamera.takeImage();

	expect(jpegImage.indexOf(StillCamera.jpegSignature)).toBe(0);
});
