import { describe, expect, test } from 'vitest';

import {
  ALL_HISTORICAL__BeverageV1EntryExamples,
  ALL_HISTORICAL__BeverageV1EntryMilestones,
  type ALL_HISTORICAL__BeverageV1EntryTypes,
  ALL_HISTORICAL__BeverageV1FetchParamExamples,
  ALL_HISTORICAL__BeverageV1FetchParamMilestones,
  type ALL_HISTORICAL__BeverageV1FetchParamTypes,
  ALL_HISTORICAL__BeverageV1PayloadExamples,
  ALL_HISTORICAL__BeverageV1PayloadMilestones,
  type ALL_HISTORICAL__BeverageV1PayloadTypes,
} from '../HISTORICAL_BEVERAGE_V1_TYPES.js';
import { expectAssignable } from './testUtils.js';

// The historical examples must match the historical typings

expectAssignable<Array<ALL_HISTORICAL__BeverageV1FetchParamTypes>>(
  ALL_HISTORICAL__BeverageV1FetchParamExamples,
);

expectAssignable<Array<ALL_HISTORICAL__BeverageV1EntryTypes>>(
  ALL_HISTORICAL__BeverageV1EntryExamples,
);

expectAssignable<Array<ALL_HISTORICAL__BeverageV1PayloadTypes>>(
  ALL_HISTORICAL__BeverageV1PayloadExamples,
);

// Ensure that those historical examples include all milestones
// (If you missed one, it needs to be added to the bottom of `HISTORICAL_BEVERAGE_V1_TYPES.ts`)

describe('HISTORICAL_BEVERAGE_V1_TYPES', () => {
  test('ALL_HISTORICAL__BeverageV1FetchParamExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__BeverageV1FetchParamMilestones.flatMap(
      (milestone) => milestone.examples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__BeverageV1FetchParamExamples.length,
    );
  });
  test('ALL_HISTORICAL__BeverageV1EntryExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__BeverageV1EntryMilestones.flatMap(
      (milestone) => milestone.examples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__BeverageV1EntryExamples.length,
    );
  });
  test('ALL_HISTORICAL__BeverageV1PayloadExamples includes all milestones', () => {
    const allExamplesFromAllMilestones = ALL_HISTORICAL__BeverageV1PayloadMilestones.flatMap(
      (milestone) => milestone.examples,
    );
    expect(allExamplesFromAllMilestones.length).toEqual(
      ALL_HISTORICAL__BeverageV1PayloadExamples.length,
    );
  });
});
