import z from 'zod/v4';

import { beverageV1EntryExamples, beverageV1EntrySchema } from './beverageV1NestedValues.js';

/*
 * "Beverages" is just a made-up reference type.
 * https://stevenpautz.com/en/blog/2025/beverages/
 */

/**
 * This tracks the shape of a full beverageV1 payload.
 * In a real app you'd probably get this stuff from a backend instead of a json config:
 * this is just an example.
 *
 * Schemas should be non-strict (z.looseObject(), not z.strictObject()) to accommodate future values.
 */
const beverageV1PayloadSchema = z.looseObject({
  lastUpdatedAt: z.string(),
  beverages: z.array(beverageV1EntrySchema),
});

type BeverageV1Payload = z.infer<typeof beverageV1PayloadSchema>;

/**
 * Some examples of full beverageV1 payloads, used for testing.
 */
const beverageV1PayloadExamples = [
  {
    lastUpdatedAt: '2026-01-01T00:00:00.000Z',
    beverages: [],
  },
  {
    lastUpdatedAt: '2026-01-02T00:00:00.000Z',
    beverages: [beverageV1EntryExamples[0]],
  },
  {
    lastUpdatedAt: '2026-01-04T00:00:00.000Z',
    beverages: [...beverageV1EntryExamples],
  },
] as const;

const isValidBeverageV1Payload = (rawData: unknown): rawData is BeverageV1Payload => {
  const validation = beverageV1PayloadSchema.safeParse(rawData);
  return validation.success;
};

const parseBeverageV1Payload = (rawData: unknown): BeverageV1Payload => {
  return beverageV1PayloadSchema.parse(rawData);
};

export type { BeverageV1Payload };
export {
  beverageV1PayloadSchema,
  beverageV1PayloadExamples,
  isValidBeverageV1Payload,
  parseBeverageV1Payload,
};
