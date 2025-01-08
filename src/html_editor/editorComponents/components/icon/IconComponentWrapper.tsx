import Icon from '@mdi/react'
import { Box } from '@mui/material'

export const IconComponentWrapper = (props: any) => {
  const { rootInjection, sx, path, ...rest } = props

  const isVerticalPaddingSet =
    sx?.pt ||
    sx?.pb ||
    sx?.py ||
    sx?.p ||
    sx?.padding ||
    sx?.py ||
    sx?.paddingTop ||
    sx?.paddingBottom
  return (
    <Box
      sx={sx}
      width="max-content"
      height={isVerticalPaddingSet ? undefined : rest?.size}
    >
      <Icon path={path ?? ''} {...rest} />
      {rootInjection}
    </Box>
  )
}
