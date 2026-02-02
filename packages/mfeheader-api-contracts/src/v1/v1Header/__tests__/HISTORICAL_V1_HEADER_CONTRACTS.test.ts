import { describe, expect, test } from 'vitest';
import {
  type ALL_HISTORICAL__V1HeaderMountOptionsTypes,
  type ALL_HISTORICAL__V1HeaderMountReturnTypes,
  type ALL_HISTORICAL__V1HeaderPrerenderOptionsTypes,
  type ALL_HISTORICAL__V1HeaderPrerenderReturnTypes,
  type ALL_HISTORICAL__V1HeaderRehydrateOptionsTypes,
  type ALL_HISTORICAL__V1HeaderRehydrateReturnTypes,
  ALL_HISTORICAL__v1HeaderMountMilestones,
  ALL_HISTORICAL__v1HeaderMountOptionsExamples,
  ALL_HISTORICAL__v1HeaderMountReturnExamples,
  ALL_HISTORICAL__v1HeaderPrerenderMilestones,
  ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples,
  ALL_HISTORICAL__v1HeaderPrerenderReturnExamples,
  ALL_HISTORICAL__v1HeaderRehydrateMilestones,
  ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples,
  ALL_HISTORICAL__v1HeaderRehydrateReturnExamples,
} from '../HISTORICAL_V1_HEADER_CONTRACTS.ts';
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

// Validate all historical examples against the historical typings.
// In general the examples should be `as const satisfies ...`, which would make these checks
// redundant. They're repeated here as an extra safety net.
ALL_HISTORICAL__v1HeaderMountOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderMountOptionsTypes>
>;
ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderRehydrateOptionsTypes>
>;
ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderPrerenderOptionsTypes>
>;

ALL_HISTORICAL__v1HeaderMountReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderMountReturnTypes>
>;
ALL_HISTORICAL__v1HeaderRehydrateReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderRehydrateReturnTypes>
>;
ALL_HISTORICAL__v1HeaderPrerenderReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderPrerenderReturnTypes>
>;

// Historical examples must still be valid for the current types,
ALL_HISTORICAL__v1HeaderMountOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderMountOptionsTypes>
>;
ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderRehydrateOptionsTypes>
>;
ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderPrerenderOptionsTypes>
>;

ALL_HISTORICAL__v1HeaderMountReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderMountReturnTypes>
>;
ALL_HISTORICAL__v1HeaderRehydrateReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderRehydrateReturnTypes>
>;
ALL_HISTORICAL__v1HeaderPrerenderReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderPrerenderReturnTypes>
>;

// The current types and the current examples must satisfy the historical contracts
null as unknown as V1Header_MountOptions satisfies ALL_HISTORICAL__V1HeaderMountOptionsTypes;
null as unknown as V1Header_RehydrateOptions satisfies ALL_HISTORICAL__V1HeaderRehydrateOptionsTypes;
null as unknown as V1Header_PrerenderOptions satisfies ALL_HISTORICAL__V1HeaderPrerenderOptionsTypes;

v1Header_mountOptionsExamples satisfies Readonly<Array<ALL_HISTORICAL__V1HeaderMountOptionsTypes>>;
v1Header_rehydrateOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderRehydrateOptionsTypes>
>;
v1Header_prerenderOptionsExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderPrerenderOptionsTypes>
>;

null as unknown as V1Header_MountReturn satisfies ALL_HISTORICAL__V1HeaderMountReturnTypes;
null as unknown as V1Header_RehydrateReturn satisfies ALL_HISTORICAL__V1HeaderRehydrateReturnTypes;
null as unknown as V1Header_PrerenderReturn satisfies ALL_HISTORICAL__V1HeaderPrerenderReturnTypes;

v1Header_mountReturnExamples satisfies Readonly<Array<ALL_HISTORICAL__V1HeaderMountReturnTypes>>;
v1Header_rehydrateReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderRehydrateReturnTypes>
>;
v1Header_prerenderReturnExamples satisfies Readonly<
  Array<ALL_HISTORICAL__V1HeaderPrerenderReturnTypes>
>;

describe('HISTORICAL_HEADER_V1_TYPES', () => {
  // Ensure that the historical examples include all milestones
  // (If you missed one, it needs to be added to the bottom of `HISTORICAL_V1_FETCH_PARAMS.ts`)
  test('ALL_HISTORICAL__v1HeaderMountOptionsExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1HeaderMountMilestones.flatMap(
      (milestone) => milestone.optionsExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1HeaderMountOptionsExamples.length,
    );
  });
  test('ALL_HISTORICAL__v1HeaderMountReturnExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1HeaderMountMilestones.flatMap(
      (milestone) => milestone.returnExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1HeaderMountReturnExamples.length,
    );
  });

  test('ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1HeaderRehydrateMilestones.flatMap(
      (milestone) => milestone.optionsExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples.length,
    );
  });
  test('ALL_HISTORICAL__v1HeaderRehydrateReturnExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1HeaderRehydrateMilestones.flatMap(
      (milestone) => milestone.returnExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1HeaderRehydrateReturnExamples.length,
    );
  });

  test('ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1HeaderPrerenderMilestones.flatMap(
      (milestone) => milestone.optionsExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples.length,
    );
  });
  test('ALL_HISTORICAL__v1HeaderPrerenderReturnExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__v1HeaderPrerenderMilestones.flatMap(
      (milestone) => milestone.returnExamples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__v1HeaderPrerenderReturnExamples.length,
    );
  });

  test.each(
    ALL_HISTORICAL__v1HeaderMountOptionsExamples,
  )('Historical option examples all pass current schema (#%#)', (exampleMountOptions) => {
    const result = v1Header_mountOptionsSchema.safeParse(exampleMountOptions);
    expect(result.error).toBeFalsy();
  });

  test.each(
    ALL_HISTORICAL__v1HeaderRehydrateOptionsExamples,
  )('Historical rehydrate examples all pass current schema (#%#)', (exampleRehydrateOptions) => {
    const result = v1Header_rehydrateOptionsSchema.safeParse(exampleRehydrateOptions);
    expect(result.error).toBeFalsy();
  });

  test.each(
    ALL_HISTORICAL__v1HeaderPrerenderOptionsExamples,
  )('Historical prerender examples all pass current schema (#%#)', (examplePrerenderOptions) => {
    const result = v1Header_prerenderOptionsSchema.safeParse(examplePrerenderOptions);
    expect(result.error).toBeFalsy();
  });
});
