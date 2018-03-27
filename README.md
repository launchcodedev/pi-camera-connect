[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/servall/pi-camera-connect/master/LICENSE)
[![npm](https://img.shields.io/npm/v/pi-camera-connect.svg)](https://www.npmjs.com/package/pi-camera-connect)

# Pi Camera Connect - for NodeJS

`pi-camera-connect` is a library to capture and stream Raspberry Pi camera data directly to NodeJS.

## Why use this?

There are many NPM modules for connecting to the Raspberry Pi camera, why use this?

- **Speed:** JPEG images can be captured in ~33ms using a built in MJPEG parser
- **Efficient:** Pictures and video streams are piped directly into Node as a `Buffer`, keeping all data in memory and eliminating disk I/O
- **Usable:** Video streams are available as [`stream.Readable`](https://nodejs.org/api/stream.html#stream_class_stream_readable) objects that can be piped or listened to
- **Tested:** Contains automated tests using Jest
- **Modern:** Uses the latest ESNext features and up to date development practices
- **Structure**: Ships with TypeScript definition files

## Install
NPM
```
$ npm install --save pi-camera-connect
```
Yarn
```
$ yarn add pi-camera-connect
```

## Basic Usage

### ESNext Syntax

Image capture:
```javascript
import { StillCamera } from "pi-camera-connect";
import * as fs from "fs";

// Take still image and save to disk
const runApp = async () => {

    const stillCamera = new StillCamera();

    const image = await stillCamera.takeImage();

    fs.writeFileSync("still-image.jpg", image);
};

runApp();
```

Video capture:
```javascript
import { StreamCamera, Codec } from "pi-camera-connect";
import * as fs from "fs";

// Capture 5 seconds of H264 video and save to disk
const runApp = async () => {

    const streamCamera = new StreamCamera({
        codec: Codec.H264
    });

    const videoStream = streamCamera.createStream();

    const writeStream = fs.createWriteStream("video-stream.h264");

    videoStream.pipe(writeStream);

    await streamCamera.startCapture();
    
    await new Promise(resolve => setTimeout(() => resolve(), 5000));

    await streamCamera.stopCapture();
};

runApp();
```

### Compatible Syntax

Image capture:
```javascript
const { StillCamera } = require("pi-camera-connect");

const stillCamera = new StillCamera();

stillCamera.takeImage().then(image => {

    fs.writeFileSync("still-image.jpg", image);
});
```

Video capture:
```javascript
const { StreamCamera, Codec } = require("pi-camera-connect");

const streamCamera = new StreamCamera({
    codec: Codec.H264
});

const writeStream = fs.createWriteStream("video-stream.h264");

const videoStream = streamCamera.createStream();

videoStream.pipe(writeStream);

streamCamera.startCapture().then(() => {

    setTimeout(() => streamCamera.stopCapture(), 5000);
});
```

## Capturing an image
There are 2 ways to capture an image with `pi-camera-connect`:
1. `StillCamera.takeImage()` - *Slow, but higher quality*
    
    This is equivalent to running the `raspistill` command. Under the hood, the GPU will run a strong noise reduction algorithm to make the image appear higher quality.

    ```javascript
    import { StillCamera } from "pi-camera-connect";

    const runApp = async () => {

        const stillCamera = new StillCamera();

        const image = await stillCamera.takeImage();

        // Process image...
    };

    runApp();
    ```

2. `StreamCamera.takeImage()` - *Fast, but lower quality*

    This works by grabbing a single JPEG frame from a Motion JPEG (MJPEG) video stream . Images captured from the video port tend to have a grainier appearance due to the lack of a strong noise reduction algorithm. 
    
    Using this method, you can capture a JPEG image at more or less the frame rate of the stream, eg. 30 fps = ~33ms capture times.

    ```javascript
    import { StreamCamera, Codec } from "pi-camera-connect";

    const runApp = async () => {
        
        const streamCamera = new StreamCamera({
            codec: Codec.MJPEG
        });

        await streamCamera.startCapture();

        const image = await streamCamera.takeImage();

        // Process image...

        await streamCamera.stopCapture();
    };

    runApp();
    ```

## Capturing a video stream
Capturing a video stream is easy. There are currently 2 codecs supported: `H264` and `MJPEG`.

### Why **H264** and **MJPEG**?
The GPU on the Raspberry Pi comes with a hardware-accelerated H264 encoder and JPEG encoder. To capture videos in real time, using these hardware encoders are required.

### Stream
A standard NodeJS [readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable) is available after calling `createStream()`. As with any readable stream, it can be piped or listened to.

```javascript
import { StreamCamera, Codec } from "pi-camera-connect";
import * as fs from "fs";

const runApp = async () => {

    const streamCamera = new StreamCamera({
        codec: Codec.H264
    });

    const videoStream = streamCamera.createStream();

    const writeStream = fs.createWriteStream("video-stream.h264");

    // Pipe the video stream to our video file
    videoStream.pipe(writeStream);

    await streamCamera.startCapture();

    // We can also listen to data events as they arrive
    videoStream.on("data", data => console.log("New data", data));
    videoStream.on("end", data => console.log("Video stream has ended"));

    // Wait for 5 seconds
    await new Promise(resolve => setTimeout(() => resolve(), 5000));

    await streamCamera.stopCapture();
};

runApp();
```

You can test the video by viewing it in `omxplayer` (ships with the Pi):
```
$ omxplayer video-stream.h264
```
Note that this example produces a raw H264 video. Wrapping it in a video container (eg. MP4, MKV, etc) is out of the scope of this module.

## API
- [`StillCamera`](#stillcamera)
    - `constructor(options?: StillOptions): StillCamera`
    - `takeImage(): Promise<Buffer>`
- [`StreamCamera`](#streamcamera)
    - `constructor(options?: StreamOptions): StreamCamera`
    - `startCapture(): Promise<void>`
    - `stopCapture(): Promise<void>`
    - `createStream(): stream.Readable`
    - `takeImage(): Promise<Buffer>`
- [`Rotation`](#rotation)
- [`Flip`](#flip)
- [`Codec`](#codec)
- [`SensorMode`](#sensormode)

## `StillCamera`
A class for taking still images. Equivalent to running the `raspistill` command.

### `constructor (options?: StillOptions): StillCamera`

Instantiates a new `StillCamera` class.

```javascript
const stillCamera = new StillCamera({
    ...
});
```

`StillOptions` are:
- `width: number` - *Default: Max sensor width*
- `height: number` - *Default: Max sensor height*
- [`rotation: Rotation`](#rotation) - *Default: `Rotation.Rotate0`*
- [`flip: Flip`](#flip) - *Default: `Flip.None`*
- `delay: number` - *Default: 1 ms*

### `StillCamera.takeImage(): Promise<Buffer>`

Takes a JPEG image from the camera. Returns a `Promise` with a `Buffer` containing the image bytes.
```javascript
const stillCamera = new StillCamera();

const image = await stillCamera.takeImage();
```

## `StreamCamera`
A class for capturing a stream of camera data, either as `H264` or `MJPEG`.

### `constructor(options?: StreamOptions): StreamCamera`

Instantiates a new `StreamCamera` class.

```javascript
const streamCamera = new StreamCamera({
    ...
});
```

`StreamOptions` are:
- `width: number` - *Default: Max sensor width*
- `height: number` - *Default: Max sensor height*
- [`rotation: Rotation`](#rotation) - *Default: `Rotation.Rotate0`*
- [`flip: Flip`](#flip) - *Default: `Flip.None`*
- `bitRate: number` - *Default: 17 Mbps*
- `fps: number` - *Default: 30 fps*
- [`codec: Codec`](#codec) - *Default: `Codec.H264`*
- [`sensorMode: SensorMode`](#sensormode) - *Default: `SensorMode.AutoSelect`*

### `startCapture(): Promise<void>`
Begins the camera stream. Returns a `Promise` that is resolved when the capture has started.

### `stopCapture(): Promise<void>`
Ends the camera stream. Returns a `Promise` that is resolved when the capture has stopped.

### `createStream(): stream.Readable`
Creates a [`readable stream`](https://nodejs.org/api/stream.html#stream_class_stream_readable) of video data. There is no limit to the number of streams you can create.

Be aware that, as with any readable stream, data will buffer in memory until it is read. If you create a video stream but do not read its data, your program will quickly run out of memory.

Ways to read data so that it does not remain buffered in memory include:
- Switching the stream to 'flowing' mode by calling either `resume()`, `pipe()`, or attaching a listener to the `'data'` event
- Calling `read()` when the stream is in 'paused' mode

See the [readable stream documentation](https://nodejs.org/api/stream.html#stream_two_modes) for more information on flowing/paused modes.

```javascript
const streamCamera = new StreamCamera({
    codec: Codec.H264
});

const videoStream = streamCamera.createStream();

await streamCamera.startCapture();

videoStream.on("data", data => console.log("New video data", data));

// Wait 5 seconds
await new Promise(resolve => setTimeout(() => resolve(), 5000));

await streamCamera.stopCapture();
```

### `takeImage(): Promise<Buffer>`

Takes a JPEG image frame from an MJPEG camera stream, resulting in very fast image captures. Returns a `Promise` with a `Buffer` containing the image bytes.

*Note: `StreamOptions.codec` must be set to `Codec.MJPEG`, otherwise `takeImage()` with throw an error.*
```javascript
const streamCamera = new StreamCamera({
    codec: Codec.MJPEG
});

await streamCamera.startCapture();

const image = await streamCamera.takeImage();

await streamCamera.stopCapture();
```

## `Rotation`
Image rotation options.
- `Rotation.Rotate0`
- `Rotation.Rotate90`
- `Rotation.Rotate180`
- `Rotation.Rotate270`

```javascript
import { Rotation } from "pi-camera-connect";
```

## `Flip`
Image flip options.
- `Flip.None`
- `Flip.Horizontal`
- `Flip.Vertical`
- `Flip.Both`

```javascript
import { Flip } from "pi-camera-connect";
```

## `Codec`
Stream codec options.
- `Codec.H264`
- `Codec.MJPEG`

```javascript
import { Codec } from "pi-camera-connect";
```

## `SensorMode`
Stream sensor mode options.
- `SensorMode.AutoSelect`
- `SensorMode.Mode1`
- `SensorMode.Mode2`
- `SensorMode.Mode3`
- `SensorMode.Mode4`
- `SensorMode.Mode5`
- `SensorMode.Mode6`
- `SensorMode.Mode7`

```javascript
import { SensorMode } from "pi-camera-connect";
```

These are slightly different depending on the version of Raspberry Pi camera you are using.

#### Camera version 1.x (OV5647):

| Mode |        Size         | Aspect Ratio | Frame rates |   FOV   |    Binning    |
|------|---------------------|--------------|-------------|---------|---------------|
|    0 | automatic selection |              |             |         |               |
|    1 | 1920x1080           | 16:9         | 1-30fps     | Partial | None          |
|    2 | 2592x1944           | 4:3          | 1-15fps     | Full    | None          |
|    3 | 2592x1944           | 4:3          | 0.1666-1fps | Full    | None          |
|    4 | 1296x972            | 4:3          | 1-42fps     | Full    | 2x2           |
|    5 | 1296x730            | 16:9         | 1-49fps     | Full    | 2x2           |
|    6 | 640x480             | 4:3          | 42.1-60fps  | Full    | 2x2 plus skip |
|    7 | 640x480             | 4:3          | 60.1-90fps  | Full    | 2x2 plus skip |


#### Camera version 2.x (IMX219):

| Mode |        Size         | Aspect Ratio | Frame rates |   FOV   | Binning |
|------|---------------------|--------------|-------------|---------|---------|
|    0 | automatic selection |              |             |         |         |
|    1 | 1920x1080           | 16:9         | 0.1-30fps   | Partial | None    |
|    2 | 3280x2464           | 4:3          | 0.1-15fps   | Full    | None    |
|    3 | 3280x2464           | 4:3          | 0.1-15fps   | Full    | None    |
|    4 | 1640x1232           | 4:3          | 0.1-40fps   | Full    | 2x2     |
|    5 | 1640x922            | 16:9         | 0.1-40fps   | Full    | 2x2     |
|    6 | 1280x720            | 16:9         | 40-90fps    | Partial | 2x2     |
|    7 | 640x480             | 4:3          | 40-90fps    | Partial | 2x2     |
