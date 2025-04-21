import { Box, BoxProps } from '@mui/material'
import { CSSProperties, ReactNode, useMemo } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'

export type BoxWrapperProps = CommonComponentPropertys & {
  children?: ReactNode
  rootInjection: ReactNode
  sx?: BoxProps['sx'] & CSSProperties
}
export const BoxWrapper = (props: BoxWrapperProps) => {
  const {
    rootInjection,
    children,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    appController,
    editorStateUi,
    assets,
    id,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    sx,
    ...rest
  } = props

  const sxAdjusted = useMemo(() => {
    const hasBgImage = sx?.backgroundImage
    const foundImage = assets.images.find(
      (img) => img.asset_id === sx?.backgroundImage
    )?.src
    if (hasBgImage && foundImage) {
      return { ...sx, backgroundImage: 'url(' + foundImage + ')' }
    }
    return sx
  }, [sx, assets])

  return (
    <Box {...rest} sx={sxAdjusted}>
      {children}
      {rootInjection}
    </Box>
  )
}
