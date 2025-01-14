import { Theme } from '@mui/material'
import { ThemeColorsEnum } from '../../../utils/types'
import { ThemeSingleColor } from './ThemeSingleColorSelector'
import { MouseEvent, useCallback } from 'react'

export type ThemeColorsProps = {
  themeColorName: ThemeColorsEnum
  onChange?: (e: MouseEvent<HTMLDivElement>, color: string) => void
  themeIn?: Theme
}

export const ThemeColorObjectSelector = (props: ThemeColorsProps) => {
  const { themeColorName, onChange, themeIn } = props

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
        themeIn={themeIn}
      />
      <ThemeSingleColor
        color={`${themeColorName}.light`}
        onChange={handleChangeThemeColor}
        themeIn={themeIn}
      />
      <ThemeSingleColor
        color={`${themeColorName}.dark`}
        onChange={handleChangeThemeColor}
        themeIn={themeIn}
      />
    </>
  )
}
