// Clean fixture: conditional spread that omits a key instead of writing an
// empty object into the options bag. This is the accepted idiom for building
// option objects (no-conditional-empty-object-spread is off for exactly this
// pattern; see oxlint.config.ts).
export interface DateFormatOptions {
  month: "long";
  year?: "numeric";
}

export function dateFormatOptions(includeYear: boolean): DateFormatOptions {
  return {
    month: "long",
    ...(includeYear ? { year: "numeric" as const } : {}),
  };
}
