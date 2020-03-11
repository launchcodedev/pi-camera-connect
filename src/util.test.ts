import { spawnPromise } from './util';

test('spawnPromise() returns stdout from child process', async () => {
  const textToPrint = 'Hello world!';

  const echoData = await spawnPromise('printf', [textToPrint]);

  expect(echoData.toString('ascii')).toBe(textToPrint);
});

test('spawnPromise() throws error when child process prints to stderr', () => {
  const textToPrint = 'This should be an error!';

  const promise = spawnPromise('/bin/sh', ['-c', `printf "${textToPrint}" 1>&2`]);

  expect(promise).rejects.toMatchObject(new Error(textToPrint));
});
