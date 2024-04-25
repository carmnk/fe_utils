import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material'

export type GridProps = Omit<BoxProps, 'display'>

export const Grid = styled((props: BoxProps) => {
  const {
    /*  eslint-disable @typescript-eslint/no-unused-vars */
    display,
    /*  eslint-enable @typescript-eslint/no-unused-vars */
    children,
    ...restProps
  } = props
  return <Box {...restProps}>{children}</Box>
})<GridProps>({
  display: 'grid',
})
