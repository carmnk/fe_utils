import { Typography, TypographyProps, useTheme } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'
import { isThemeColor } from '../../../utils/isThemeColor'

export type TypographyWrapperProps = CommonComponentPropertys &
  TypographyProps & {
    rootInjection: ReactNode
    allProps: unknown
  }
export const TypographyWrapper = (props: TypographyWrapperProps) => {
  const {
    children,
    rootInjection,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    appController,
    editorStateUi,
    assets,
    id,
    isProduction,
    icons,
    allProps,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    sx,
    ...rest
  } = props
  const theme = useTheme()

  const sxAdj = useMemo(() => {
    if (!sx) return undefined
    const textDecorationColorValue =
      'textDecorationColor' in sx && typeof sx.textDecorationColor === 'string'
        ? sx.textDecorationColor
        : undefined
    const textDecorationColor =
      textDecorationColorValue && isThemeColor(textDecorationColorValue)
        ? (() => {
            const colorPaletteName = textDecorationColorValue?.split?.('.')[0]
            const colorPaletteNameVariantName =
              textDecorationColorValue?.split?.('.')[1]
            return theme.palette[colorPaletteName as 'primary'][
              colorPaletteNameVariantName as 'main'
            ]
          })()
        : undefined

    const textShadow = (() => {
      const textShadowValue =
        'textShadow' in sx && typeof sx.textShadow === 'string'
          ? sx.textShadow
          : undefined
      if (!textShadowValue) {
        return undefined
      }

      const textShadowColorValue = textShadowValue
        ? textShadowValue.trim().split(' ')?.slice(3).join('')
        : undefined
      const textShadowColorValueIn = textShadowValue
        ? textShadowValue.trim().split(' ')?.slice(3).join(' ')
        : undefined
      if (!textShadowColorValue || !textShadowColorValueIn) return undefined
      const isColorThemeColor = isThemeColor(textShadowColorValue)
      if (!isColorThemeColor) return undefined

      const paletteColor = textShadowColorValue?.split('.')?.[0]
      const paletteColorVariant = textShadowColorValue?.split('.')?.[1]
      const colorAdj =
        theme.palette[paletteColor as 'primary'][paletteColorVariant as 'main']
      const textShadowAdj = [
        ...textShadowValue.split(' ').slice(0, 3),
        ' ' + colorAdj,
      ].join(' ')
      return textShadowAdj
    })()

    const newSx =
      textDecorationColor && textShadow
        ? { ...(sx ?? {}), textDecorationColor, textShadow }
        : textDecorationColor
          ? { ...(sx ?? {}), textDecorationColor }
          : textShadow
            ? { ...(sx ?? {}), textShadow }
            : sx
    return newSx
  }, [sx, theme])

  const restAdj = useMemo(() => {
    return Object.keys(rest).reduce((acc, cur, idx) => {
      if (rest?.[cur as keyof typeof rest]) {
        return { ...acc, [cur]: (rest as any)?.[cur] }
      }
      return acc
    }, {})
  }, [rest])

  return (
    <Typography {...restAdj} sx={sxAdj}>
      {children}
      {rootInjection}
    </Typography>
  )
}
