import { BoxProps, styled, Box } from '@mui/material'
import { FC } from 'react'

export type GridProps = Omit<BoxProps, 'display'>

export const Grid = styled((props: BoxProps) => {
  const {
    /*  eslint-disable @typescript-eslint/no-unused-vars */
    display,
    /*  eslint-enable @typescript-eslint/no-unused-vars */
    children,
    ...restProps
  } = props
  return (
    <Box {...restProps} display="grid">
      {children}
    </Box>
  )
})() as FC<BoxProps>
