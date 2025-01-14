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
    appController,
    editorStateUi,
    id,
    isProduction,
    ...rest
  } = props
  
  return (
    <Typography {...rest}>
      {children}
      {rootInjection}
    </Typography>
  )
}
