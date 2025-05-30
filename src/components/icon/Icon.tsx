import { Box, BoxProps, SxProps, useTheme } from '@mui/material'
import { CSSProperties, ReactNode, useMemo } from 'react'
import { isThemeColor } from '../../html_editor/utils/isThemeColor'

export type IconProps = {
  sx: SxProps & BoxProps
  color?: string
  path: string
  rootInjection: ReactNode
  size?: string
  horizontal?: boolean
  vertical?: boolean
  rotate?: string
}

export const CIcon = (props: IconProps) => {
  const {
    rootInjection,
    sx,
    path,
    color: colorRaw,
    size = '1.5rem',
    horizontal,
    vertical,
    rotate,
    // ...rest
  } = props
  const theme = useTheme()
  const color = typeof colorRaw === 'string' ? colorRaw.trim() : colorRaw
  const colorAdj =
    typeof color === 'string' && isThemeColor(color)
      ? theme?.palette[color.split('.')[0] as 'primary']?.[
          color.split('.')[1] as 'main'
        ]
      : color

  const sxAdj = useMemo(() => {
    const transformValue =
      horizontal && vertical
        ? 'scaleX(-1) scaleY(-1)'
        : horizontal
          ? 'scaleX(-1)'
          : vertical
            ? 'scaleY(-1)'
            : (sx as CSSProperties)?.transform
    return {
      ...(sx ?? {}),
      rotate,
      transform: transformValue,
    }
  }, [sx, rotate, horizontal, vertical])

  return (
    <Box
      component={'svg'}
      position="relative"
      viewBox="0 0 24 24"
      role="presentation"
      sx={sxAdj}
      color={colorAdj}
      height={size}
      width={size}
    >
      <Box component="path" sx={{ fill: colorAdj }} d={path} />
      {rootInjection}
    </Box>
  )
}
