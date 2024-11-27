import Box, { BoxProps } from '@mui/material/Box'

export type ImgProps = Omit<BoxProps, 'component'>

export const Img = (props: Omit<BoxProps<'img'>, 'component'>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...restProps } = props
  return <Box {...restProps} component="img" />
}
