const convertCaughtValueToError = (value: unknown): Error => {
  const error = value instanceof Error ? value : new Error(String(value));
  return error;
};

export { convertCaughtValueToError };
