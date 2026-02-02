import { describe, expect, test } from 'vitest';
import {
  type V1Header_MountOptions,
  type V1Header_MountReturn,
  type V1Header_PrerenderOptions,
  type V1Header_PrerenderReturn,
  type V1Header_RehydrateOptions,
  type V1Header_RehydrateReturn,
  v1Header_mountOptionsExamples,
  v1Header_mountOptionsSchema,
  v1Header_mountReturnExamples,
  v1Header_prerenderOptionsExamples,
  v1Header_prerenderOptionsSchema,
  v1Header_prerenderReturnExamples,
  v1Header_rehydrateOptionsExamples,
  v1Header_rehydrateOptionsSchema,
  v1Header_rehydrateReturnExamples,
} from '../v1HeaderContracts.ts';

// Validate all examples against their typings.
// In general the examples should be `as const satisfies ...`, which would make these checks
// redundant. They're repeated here as an extra safety net.

v1Header_mountOptionsExamples satisfies ReadonlyArray<V1Header_MountOptions>;
v1Header_mountReturnExamples satisfies ReadonlyArray<V1Header_MountReturn>;

v1Header_rehydrateOptionsExamples satisfies ReadonlyArray<V1Header_RehydrateOptions>;
v1Header_rehydrateReturnExamples satisfies ReadonlyArray<V1Header_RehydrateReturn>;

v1Header_prerenderOptionsExamples satisfies ReadonlyArray<V1Header_PrerenderOptions>;
v1Header_prerenderReturnExamples satisfies ReadonlyArray<V1Header_PrerenderReturn>;

// Validate all examples against their schemas
describe('V1 Header Contracts', () => {
  test.each(
    v1Header_mountOptionsExamples,
  )('Mount option examples all pass current schema (#%#)', (exampleMountOptions) => {
    const result = v1Header_mountOptionsSchema.safeParse(exampleMountOptions);
    expect(result.error).toBeFalsy();
  });

  test.each(
    v1Header_rehydrateOptionsExamples,
  )('Rehydrate option examples all pass current schema (#%#)', (exampleRehydrateOptions) => {
    const result = v1Header_rehydrateOptionsSchema.safeParse(exampleRehydrateOptions);
    expect(result.error).toBeFalsy();
  });

  test.each(
    v1Header_prerenderOptionsExamples,
  )('Prerender option examples all pass current schema (#%#)', (examplePrerenderOptions) => {
    const result = v1Header_prerenderOptionsSchema.safeParse(examplePrerenderOptions);
    expect(result.error).toBeFalsy();
  });
});
