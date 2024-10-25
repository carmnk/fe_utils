import { v4 as uuid } from 'uuid'
import { ExtendedTheme } from '../../theme/muiTheme'
import { createMuiTheme } from '../../theme/createTheme'
import { SerializedThemeType } from '../types/serializedTheme'
import { ThemeTypography } from '../types/themeTypographys'
import { CSSProperties } from 'react'

export const transformEditorStateTheme = (
  themes: ExtendedTheme[],
  project_id: string
): SerializedThemeType[] => {
  return (
    themes?.map?.((theme) => ({
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
    })) ?? []
  )
}

export const reloadSerializedThemes = (
  themesIn: SerializedThemeType[],
  themes: ExtendedTheme[],
  theme_typographys: ThemeTypography[]
): ExtendedTheme[] => {
  const loadedThemes = themesIn?.map((themeIn) => {
    const currentThemeProps = themes.find(
      (t) => t.palette.mode === themeIn.mode
    )
    const injectCurrentThemeTypographyProps = {
      typography: currentThemeProps?.typography,
    }
    const themeTypographys = theme_typographys.filter(
      (tt) => tt.theme_id === themeIn.id
    )
    const newThemeStatic = {
      ...injectCurrentThemeTypographyProps,
      palette: {
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
        mode: themeIn?.mode ?? 'light',
      },
    }

    if (themeTypographys.length > 0) {
      newThemeStatic.typography = {
        ...currentThemeProps?.typography,
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
            subTypography.color = color
          }
          return { ...acc, [name]: subTypography }
        }, {}) ?? {}),
      } as any
    }

    // // undefined values have to be removed
    // const paletteRaw = newThemeStatic.palette
    // const paletteObjectKeys = Object.keys(paletteRaw).filter((key) => {
    //   return typeof paletteRaw[key as keyof typeof paletteRaw] === 'object'
    // })
    // for (const key of paletteObjectKeys) {
    //   const paletteColor = paletteRaw[key as keyof typeof paletteRaw]
    //   const colorKeys = Object.keys(paletteColor)
    //   colorKeys.forEach((colorKey) => {
    //     const color = paletteColor[colorKey as keyof typeof paletteColor]
    //     if (!color) {
    //       delete paletteColor[colorKey as keyof typeof paletteColor]
    //     }
    //   })
    // }

    // const muiTheme = responsiveFontSizes(createTheme(newThemeStatic), {
    //   factor: 2,
    // })
    // const theme = { ...muiTheme, name: themeIn.name, id: themeIn.id }

    const muiTheme = {
      ...createMuiTheme({
        ...newThemeStatic,
      } as any),
      name: themeIn.name,
      id: themeIn.id,
    }
    return muiTheme
  })
  return loadedThemes
}
