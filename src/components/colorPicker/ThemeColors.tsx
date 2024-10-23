import { ThemeColorsEnum } from '../../utils/types'
import { ThemeSingleColor } from './ThemeSingleColor'
import { MouseEvent, useCallback } from 'react'

export type ThemeColorsProps = {
  themeColorName: ThemeColorsEnum
  onChange?: (e: MouseEvent<HTMLDivElement>, color: string) => void
}

export const ThemeColors = (props: ThemeColorsProps) => {
  const { themeColorName, onChange } = props

  const handleChangeThemeColor = useCallback(
    (e: MouseEvent<HTMLDivElement>, colorIn: string) => {
      onChange?.(e, colorIn)
    },
    [onChange]
  )

  if (!themeColorName || !ThemeColorsEnum[themeColorName]) {
    console.warn('Invalid theme color name', themeColorName)
    return null
  }
  return (
    <>
      <ThemeSingleColor
        color={`${themeColorName}.main`}
        onChange={handleChangeThemeColor}
      />
      <ThemeSingleColor
        color={`${themeColorName}.light`}
        onChange={handleChangeThemeColor}
      />
      <ThemeSingleColor
        color={`${themeColorName}.dark`}
        onChange={handleChangeThemeColor}
      />
    </>
  )
}
