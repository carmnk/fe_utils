export type MatchingObjectKeys<O, MatchType> = {
  [K in keyof O]-?: O[K] extends MatchType ? K : never
}[keyof O]

export enum ThemeColorsEnum {
  primary = 'primary',
  secondary = 'secondary',
  error = 'error',
  warning = 'warning',
  info = 'info',
  success = 'success',
}

export enum ThemeTextColorsEnum {
  primary = 'text.primary',
  secondary = 'text.secondary',
  disabled = 'text.disabled',
}
export enum ThemeBackgroundColorsEnum {
  default = 'background.default',
  paper = 'background.paper',
}

export enum ThemeActionColorsEnum {
  active = 'action.active',
  disabled = 'action.disabled',
  disabledBackground = 'action.disabledBackground',
  focus = 'action.focus',
  hover = 'action.hover',
  selected = 'action.selected',
}
