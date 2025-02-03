import Icon from '@mdi/react'
import { IconProps } from '@mdi/react/dist/IconProps'
import { Box, BoxProps, SxProps } from '@mui/material'
import { CommonComponentPropertys } from '../../componentProperty'
import { ReactNode } from 'react'

export type IconComponentWrapperProps = IconProps & {
  sx: SxProps & BoxProps
  rootInjection: ReactNode
} & CommonComponentPropertys

export const IconComponentWrapper = (props: IconComponentWrapperProps) => {
  const {
    rootInjection,
    sx,
    path,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    appController,
    editorStateUi,
    isProduction,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

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
      height={isVerticalPaddingSet ? undefined : (rest?.size ?? undefined)}
    >
      <Icon path={path ?? ''} {...rest} />
      {rootInjection}
    </Box>
  )
}
