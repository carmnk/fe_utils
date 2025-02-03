import { ExtendedTheme } from '../../../theme/muiTheme'
import { createMuiTheme } from '../../../theme/createTheme'
import { SerializedThemeType } from '../../../types/serializedTheme'
import { ThemeTypography } from '../../../types/themeTypographys'
import { CSSProperties } from 'react'
import { Typography } from '@mui/material/styles/createTypography'
import { PaletteMode, Theme, Palette } from '@mui/material'
import { resolveTypographyThemeColors } from '../utils/resolveThemeColors'

export const deserializeThemePalette = (themeIn: SerializedThemeType) => {
  return {
    primary: {
      main: themeIn.primary_main,
      light: themeIn.primary_light,
      dark: themeIn.primary_dark,
      contrastText: themeIn.primary_contrasttext,
    },
    secondary: {
      main: themeIn.secondary_main,
      light: themeIn.secondary_light,
      dark: themeIn.secondary_dark,
      contrastText: themeIn.secondary_contrasttext,
    },
    error: {
      main: themeIn.error_main,
      light: themeIn.error_light,
      dark: themeIn.error_dark,
      contrastText: themeIn.error_contrasttext,
    },
    warning: {
      main: themeIn.warning_main,
      light: themeIn.warning_light,
      dark: themeIn.warning_dark,
      contrastText: themeIn.warning_contrasttext,
    },
    info: {
      main: themeIn.info_main,
      light: themeIn.info_light,
      dark: themeIn.info_dark,
      contrastText: themeIn.info_contrasttext,
    },
    success: {
      main: themeIn.success_main,
      light: themeIn.success_light,
      dark: themeIn.success_dark,
      contrastText: themeIn.success_contrasttext,
    },
    text: {
      primary: themeIn.text_primary,
      secondary: themeIn.text_secondary,
      disabled: themeIn.text_disabled,
    },
    background: {
      default: themeIn.background_default,
      paper: themeIn.background_paper,
    },
    action: {
      active: themeIn.action_active,
      hover: themeIn.action_hover,
      selected: themeIn.action_selected,
      disabled: themeIn.action_disabled,
      disabledBackground: themeIn.action_disabled_background,
      focus: themeIn.action_focus,
    },
    mode: (themeIn?.mode as PaletteMode) ?? ('light' as const),
  }
}
export const deserializeThemeTypography = (
  themeTypographys: ThemeTypography[],
  newPalette: ReturnType<typeof deserializeThemePalette>
): Partial<Theme['typography']> => {
  if (themeTypographys.length > 0) {
    return {
      // ...currentThemeProps?.typography,
      ...(themeTypographys.reduce((acc, tt) => {
        const name = tt.name
        const fontSize = tt.font_size
        const fontWeight = tt.font_weight
        const fontStyle = tt.font_style
        const fontFamily = tt.font_family
        const color = tt.font_color
        const subTypography: CSSProperties & { name: string } = {
          name,
        }
        if (fontSize) {
          subTypography.fontSize = fontSize
        }
        if (fontWeight) {
          subTypography.fontWeight = fontWeight
        }
        if (fontStyle) {
          subTypography.fontStyle = fontStyle
        }
        if (fontFamily) {
          subTypography.fontFamily = fontFamily
        }
        if (color) {
          const colorResolved = resolveTypographyThemeColors(
            color,
            newPalette as Palette
          )
          const colorAdj = colorResolved ?? color
          subTypography.color = colorAdj
        }
        return { ...acc, [name]: subTypography }
      }, {}) ?? {}),
    } as Typography
  }
  return {}
}

export const deserializeTheme = (
  themeIn: SerializedThemeType,
  theme_typographys: ThemeTypography[]
): ExtendedTheme => {
  const themeTypographys =
    theme_typographys?.filter?.((tt) => tt.theme_id === themeIn.id) ?? []

  const newPalette = deserializeThemePalette(themeIn) as Palette
  const newThemeStatic: {
    // name: string
    // id: string
    palette: Palette
    typography?: Theme['typography']
  } = {
    palette: newPalette,
  }

  if (themeTypographys.length > 0) {
    newThemeStatic.typography = {
      ...(themeTypographys.reduce((acc, tt) => {
        const name = tt.name
        const fontSize = tt.font_size
        const fontWeight = tt.font_weight
        const fontStyle = tt.font_style
        const fontFamily = tt.font_family
        const color = tt.font_color
        const subTypography: CSSProperties & { name: string } = {
          name,
        }
        if (fontSize) {
          subTypography.fontSize = fontSize
        }
        if (fontWeight) {
          subTypography.fontWeight = fontWeight
        }
        if (fontStyle) {
          subTypography.fontStyle = fontStyle
        }
        if (fontFamily) {
          subTypography.fontFamily = fontFamily
        }
        if (color) {
          const colorResolved = resolveTypographyThemeColors(color, newPalette)
          const colorAdj = colorResolved ?? color
          subTypography.color = colorAdj
        }
        return { ...acc, [name]: subTypography }
      }, {}) ?? {}),
    } as Typography
  }

  const muiTheme = {
    ...createMuiTheme({
      ...newThemeStatic,
      name: themeIn.name,
      id: themeIn.id,
    }),
    name: themeIn.name,
    id: themeIn.id,
  }
  return muiTheme
}
