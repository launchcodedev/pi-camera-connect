import { spawnPromise } from "../util";
import { Rotation, Flip } from "..";

export interface StillOptions {
	width?: number;
	height?: number;
	rotation?: Rotation;
	flip?: Flip;
	delay?: number;
}

export default class StillCamera {

	static readonly jpegSignature = Buffer.from([0xFF, 0xD8, 0xFF, 0xE1, 0x64, 0x1A, 0x45, 0x78, 0x69, 0x66, 0x00]);

	private options: StillOptions;

	constructor(options: StillOptions = {}) {

		this.options = {
			rotation: Rotation.Rotate0,
			flip: Flip.None,
			delay: 1,
			...options
		};
	}

	async takeImage() {

		try {

			return await spawnPromise("raspistill", [

				/**
				 * Width
				 */
				...(this.options.width ? ["--width", this.options.width.toString()] : []),

				/**
				 * Height
				 */
				...(this.options.height ? ["--height", this.options.height.toString()] : []),

				/**
				 * Rotation
				 */
				...(this.options.rotation ? ["--rotation", this.options.rotation.toString()] : []),

				/**
				 * Horizontal flip
				 */
				...(this.options.flip && (this.options.flip === Flip.Horizontal || this.options.flip === Flip.Both) ?
					["--hflip"] : []),

				/**
				 * Vertical flip
				 */
				...(this.options.flip && (this.options.flip === Flip.Vertical || this.options.flip === Flip.Both) ?
					["--vflip"] : []),

				/**
				 * Capture delay (ms)
				 */
				"--timeout", this.options.delay!.toString(),

				/**
				 * Do not display preview overlay on screen
				 */
				"--nopreview",

				/**
				 * Output to stdout
				 */
				"--output", "-"
			]);
		}
		catch (err) {

			if (err.code === "ENOENT") {
				throw new Error("Could not take image with StillCamera. Are you running on a Raspberry Pi with 'raspistill' installed?");
			}

			throw err;
		}
	}
}
