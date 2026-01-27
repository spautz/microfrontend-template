import { convertCaughtValueToError } from '../utils.ts';

const throwAndFailTest = (...args: unknown[]) => {
  // biome-ignore lint/suspicious/noConsole: For most tests we want to throw (and fail the test) if anything goes wrong
  console.error('throwAndFailTest: ', ...args);

  let error = args.find((value) => value instanceof Error);
  if (!error) {
    error = convertCaughtValueToError(args[0]);
  }

  throw error;
};

export { throwAndFailTest };
