import { Palette, Theme } from '@mui/material'
import { createTheme, responsiveFontSizes } from '@mui/material'

export const createMuiTheme = (
  theme: {
    name: string
    id: string
    palette: Pick<Palette, 'primary' | 'secondary' | 'mode'>
    typography?: Theme['typography']
  }
  // disableResponsiveFonts?: boolean
) => {
  const palette = theme.palette
  const paletteMainKeys = Object.keys(palette)
  const newPalette = paletteMainKeys.reduce((acc, key) => {
    const mainColor = palette[key as keyof typeof palette]
    const mainColorSubColorNames = Object.keys(mainColor)
    const subColorNames = mainColorSubColorNames.filter(
      (colorName) => mainColor[colorName as keyof typeof mainColor]
    )
    const subColors = subColorNames.reduce((acc, subColorName) => {
      const value = mainColor[subColorName as keyof typeof mainColor]
      return {
        ...acc,
        [subColorName]: value,
      }
    }, {})
    const newValue = typeof mainColor === 'object' ? subColors : mainColor
    return {
      ...acc,
      [key]: newValue,
    }
  }, {})
  const paletteKeysCleaned: { [key: string]: Palette['primary'] } = {}
  Object.keys(newPalette).forEach((key) => {
    if (Object.keys(newPalette[key as keyof typeof newPalette]).length) {
      paletteKeysCleaned[key] = newPalette[key as keyof typeof newPalette]
    }
  })
  const cleanedTheme = {
    ...theme,
    palette: paletteKeysCleaned,
  }

  const disableResponsiveFontsLocal = true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const makeResponsiveFontTheme = (theme: any) =>
    disableResponsiveFontsLocal
      ? theme
      : responsiveFontSizes<Theme>(theme, { factor: 2 })

  // const muiTheme = makeResponsiveFontTheme(createTheme(cleanedTheme))
  return {
    name: cleanedTheme.name,
    id: cleanedTheme.id,
    ...makeResponsiveFontTheme(createTheme(cleanedTheme)),
  }
}
