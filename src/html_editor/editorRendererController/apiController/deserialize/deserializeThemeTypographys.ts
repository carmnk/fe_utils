import { ThemeTypography } from '../../../types'

export const deserializeThemeTypographys = (
  themeTypographyIn: ThemeTypography[]
) => {
  const themeTypographys = themeTypographyIn.map((themeTypography) => {
    const fontWeightIn = themeTypography.font_weight
    const font_weight = fontWeightIn?.match(/^[0-9]*$/g)
      ? parseInt(fontWeightIn)
      : fontWeightIn

    return {
      ...themeTypography,
      font_weight: font_weight as string,
    }
  })
  return themeTypographys
}
