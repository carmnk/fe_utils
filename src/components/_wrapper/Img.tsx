import Box, { BoxProps } from '@mui/material/Box'

export type ImgProps = Omit<BoxProps, 'component'>

export const Img = (props: Omit<BoxProps<'img'>, 'component'>) => {
  const { children, ...restProps } = props
  return (
    <Box {...restProps} component="img">
      {children}
    </Box>
  )
}
