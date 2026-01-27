const throwAndFailTest = (message: string, error?: Error) => {
  // biome-ignore lint/suspicious/noConsole: For most tests we want to throw (and fail the test) if anything goes wrong
  console.error(message, error);
  throw error || new Error(message);
};

export { throwAndFailTest };
