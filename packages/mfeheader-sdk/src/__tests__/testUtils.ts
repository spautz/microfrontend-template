const throwAndFailTest = (error: Error, ...extraDetails: Array<unknown>) => {
  // biome-ignore lint/suspicious/noConsole: For most tests we want to throw (and fail the test) if anything goes wrong
  console.error('throwAndFailTest: ', error, ...extraDetails);
  throw error;
};

export { throwAndFailTest };
