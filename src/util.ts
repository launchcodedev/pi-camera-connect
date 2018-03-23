
import { spawn, SpawnOptions } from "child_process";

export const spawnPromise = (command: string, args?: Array<string>, options?: SpawnOptions) => new Promise<Buffer>((resolve, reject) => {

	const childProcess = spawn(command, args, options);

	let stdoutData = Buffer.alloc(0);
	let stderrData = Buffer.alloc(0);

	childProcess.once("error", (err: Error) => reject(err));

	childProcess.stdout.on("data", (data: Buffer) => stdoutData = Buffer.concat([stdoutData, data]));
	childProcess.stdout.once("error", (err: Error) => reject(err));

	childProcess.stderr.on("data", (data: Buffer) => stderrData = Buffer.concat([stderrData, data]));
	childProcess.stderr.once("error", (err: Error) => reject(err));

	childProcess.stdout.on("close", () => {

		if (stderrData.length > 0)
			return reject(new Error(stderrData.toString()));

		return resolve(stdoutData);
	});
});
