const isPromise = <T>(value: unknown): value is Promise<T> => {
  return !!value && typeof (value as Promise<T>).then === 'function';
};

export { isPromise };
