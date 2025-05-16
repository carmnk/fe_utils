import { Box, BoxProps } from '@mui/material'
import { ReactNode } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'

export type ImageWrapperProps = CommonComponentPropertys &
  BoxProps<'img'> & {
    rootInjection: ReactNode
  }
export const ImageWrapper = (props: ImageWrapperProps) => {
  const {
    children: c_out,
    rootInjection,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    appController,
    editorStateUi,
    assets,
    id,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    src,
    ...rest
  } = props

  const srcAdj =
    assets.images?.find?.((img) => img.asset_id === src)?.src ?? src

  return <Box component="img" {...rest} src={srcAdj} />
}
