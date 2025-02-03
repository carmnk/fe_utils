import { Typography, TypographyProps } from '@mui/material'
import { ReactNode } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'

export type TypographyWrapperProps = CommonComponentPropertys &
  TypographyProps & {
    rootInjection: ReactNode
  }
export const TypographyWrapper = (props: TypographyWrapperProps) => {
  const {
    children,
    rootInjection,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    appController,
    editorStateUi,
    id,
    isProduction,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

  return (
    <Typography {...rest}>
      {children}
      {rootInjection}
    </Typography>
  )
}
