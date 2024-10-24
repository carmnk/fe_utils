import { Tooltip, Box, Theme } from '@mui/material'
import { MouseEvent, useCallback } from 'react'

export type ThemeSingleColorProps = {
  color: string
  hidden?: boolean
  onChange?: (e: MouseEvent<HTMLDivElement>, color: string) => void
  themeIn?: Theme
}

export const ThemeSingleColor = (props: ThemeSingleColorProps) => {
  const { color, hidden, onChange, themeIn } = props
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onChange?.(e, color)
    },
    [onChange, color]
  )

  const colorPath = color.split('.')
  const colorCategory = colorPath[0] as keyof Theme['palette']
  const colorVariant =
    colorPath[1] as keyof Theme['palette'][typeof colorCategory]
  const colorAdj =
    themeIn && colorCategory && colorVariant
      ? themeIn?.palette?.[colorCategory]?.[colorVariant]
      : //   : themeIn && colorCategory
        //     ? themeIn?.palette?.[colorCategory]
        undefined

  console.log('COLOR PROB', themeIn, colorCategory, colorVariant, colorAdj)
  return (
    <Tooltip title={hidden ? undefined : color} placement="top" arrow>
      <Box
        bgcolor={colorAdj}
        borderRadius={'3px'}
        height={16}
        width={16}
        border="1px solid #999"
        visibility={hidden ? 'hidden' : 'visible'}
        onClick={handleClick}
      />
    </Tooltip>
  )
}
