export type MatchingObjectKeys<O, MatchType> = {
    [K in keyof O]-?: O[K] extends MatchType ? K : never
  }[keyof O]