import { ExtendedTheme } from '../../../theme/muiTheme'
import { SerializedThemeType } from '../../../types/serializedTheme'
import { v4 as uuid } from 'uuid'

export const serializeTheme = (
  theme: ExtendedTheme,
  project_id: string
): SerializedThemeType => {
  return {
    id: theme?.id ?? uuid(),
    project_id,
    name: theme.name,
    // palette
    mode: theme.palette.mode,
    primary_main: theme.palette.primary.main,
    primary_light: theme.palette.primary.light,
    primary_dark: theme.palette.primary.dark,
    primary_contrasttext: theme.palette.primary.contrastText,
    secondary_main: theme.palette.secondary.main,
    secondary_light: theme.palette.secondary.light,
    secondary_dark: theme.palette.secondary.dark,
    secondary_contrasttext: theme.palette.secondary.contrastText,
    error_main: theme.palette.error.main,
    error_light: theme.palette.error.light,
    error_dark: theme.palette.error.dark,
    error_contrasttext: theme.palette.error.contrastText,
    warning_main: theme.palette.warning.main,
    warning_light: theme.palette.warning.light,
    warning_dark: theme.palette.warning.dark,
    warning_contrasttext: theme.palette.warning.contrastText,
    info_main: theme.palette.info.main,
    info_light: theme.palette.info.light,
    info_dark: theme.palette.info.dark,
    info_contrasttext: theme.palette.info.contrastText,
    success_main: theme.palette.success.main,
    success_light: theme.palette.success.light,
    success_dark: theme.palette.success.dark,
    success_contrasttext: theme.palette.success.contrastText,

    text_primary: theme.palette.text.primary,
    text_secondary: theme.palette.text.secondary,
    text_disabled: theme.palette.text.disabled,
    background_default: theme.palette.background.paper,
    background_paper: theme.palette.background.paper,
    action_active: theme.palette.action.active,
    action_hover: theme.palette.action.hover,
    action_selected: theme.palette.action.selected,
    action_disabled: theme.palette.action.disabled,
    action_disabled_background: theme.palette.action.disabledBackground,
    action_focus: theme.palette.action.focus,
  }
}
