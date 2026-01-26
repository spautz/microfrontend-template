export const get = async (entryPoint) => {
  globalThis.__mf_test_entryPoint = entryPoint;
  return () => ({
    v1Render: () => {
      globalThis.__mf_test_render_called = true;
      return () => {};
    },
  });
};

export const init = async (shareScope) => {
  globalThis.__mf_test_share_scope = shareScope;
};
