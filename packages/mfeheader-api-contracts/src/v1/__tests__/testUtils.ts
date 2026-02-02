type ComplexBuiltinType =
  // biome-ignore lint/complexity/noBannedTypes: Not used as an explicit type-assignment here
  Function | Date | RegExp | Error | HTMLElement | Element | Node | Document | Window;

/**
 * A safe version of the normal DeepReadonly<> util, which doesn't convert complex types
 * like dom nodes into plain objects. (Converting them to plain objects causes some really
 * hideous-looking errors, and doesn't actually make the checks better)
 *
 * This is useful for checking that historical types (which tend to be readonly) still satisfy
 * the current type contracts:
 *    HISTORICAL_VALUES satisfies CurrentType                 <-- fails due to readonly types
 *    HISTORICAL_VALUES satisfies DeepReadonly<CurrentType>   <-- succeeds
 */
type DeepReadonly<T> = T extends ComplexBuiltinType
  ? T
  : T extends (infer R)[]
    ? ReadonlyArray<DeepReadonly<R>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type { DeepReadonly };
