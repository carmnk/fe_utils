import { Palette, PaletteColor } from '@mui/material'
import { EditorStateType } from '../..'
import { Typography } from '@mui/material/styles/createTypography'

const muiPaletteColors = [
  'primary.main',
  'primary.light',
  'primary.dark',
  'primary.contrastText',
  'secondary.main',
  'secondary.light',
  'secondary.dark',
  'secondary.contrastText',
  'error.main',
  'error.light',
  'error.dark',
  'error.contrastText',
  'warning.main',
  'warning.light',
  'warning.dark',
  'warning.contrastText',
  'info.main',
  'info.light',
  'info.dark',
  'info.contrastText',
  'success.main',
  'success.light',
  'success.dark',
  'success.contrastText',
  'text.primary',
  'text.secondary',
  'text.disabled',
  'background.default',
  'background.paper',
  'action.active',
  'action.hover',
  'action.selected',
  'action.disabled',
  'action.disabledBackground',
  'action.focus',
]

/** unused */
export const resolveThemeTypographyThemeColors = (
  themeTypographys: EditorStateType['theme_typographys'],
  themeId: string,
  newPalette: Palette,
  newTypography: Typography
  // themeIn: any
) => {
  const typographyColorsWithTheme = themeTypographys.filter?.((tt) => {
    return (
      tt?.theme_id === themeId &&
      muiPaletteColors.includes(tt?.font_color ?? '')
    )
  })

  const palette = newPalette
  const typography = newTypography

  const typographyColorsWithThemeKeys = typographyColorsWithTheme.map(
    (tt) => tt.name
  )

  const adjPartialTypography = typographyColorsWithThemeKeys.reduce(
    (acc, key) => {
      const variant = typography[key as keyof typeof typography]
      if (!variant) {
        return acc
      }
      const themeTypographyDb = typographyColorsWithTheme.find?.(
        (tt) => tt.theme_id === themeId && tt.name === key
      )
      if (!themeTypographyDb) {
        return acc
      }
      const fullColor = themeTypographyDb?.font_color
      // const fullColor =
      //   typeof variant === 'object' && 'color' in variant ? variant.color : null
      if (!fullColor) {
        return { ...acc, [key]: variant }
      }
      const newColor = resolveTypographyThemeColors(fullColor, palette)
      if (!newColor) {
        return { ...acc, [key]: variant }
      }
      if (muiPaletteColors.includes(fullColor)) {
        const [color, subvariant] = fullColor.split('.')
        const colorObj = palette[color as keyof typeof palette]
        if (!colorObj || typeof colorObj !== 'object') {
          return { ...acc, [key]: variant }
        }
        const adjColor = (colorObj as PaletteColor)[
          subvariant as keyof PaletteColor
        ]
        const typographyWithAdjColor = {
          ...(variant as Record<string, unknown>),
          color: adjColor,
        }
        return { ...acc, [key]: typographyWithAdjColor }
      }
      return { ...acc, [key]: variant }
    },
    {}
  )
  return { ...typography, ...adjPartialTypography }
}

export const resolveTypographyThemeColors = (
  fullColor: string,
  palette: Palette
) => {
  if (!fullColor) return null
  if (!palette) return null
  if (muiPaletteColors.includes(fullColor)) {
    const [color, subvariant] = fullColor.split('.')
    const colorObj = palette[color as keyof typeof palette]
    if (!colorObj || typeof colorObj !== 'object') return null
    const adjColor = (colorObj as PaletteColor)[
      subvariant as keyof PaletteColor
    ]
    return adjColor
  }
  return null
}
