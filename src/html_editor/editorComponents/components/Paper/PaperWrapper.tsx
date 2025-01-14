import { ReactNode } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'
import { Paper, PaperProps } from '@mui/material'

export type PaperWrapperProps = PaperProps & {
  rootInjection: ReactNode
} & CommonComponentPropertys

export const PaperWrapper = (props: PaperWrapperProps) => {
  const {
    children,
    rootInjection,
    sx,
    appController,
    editorStateUi,
    isProduction,
    ...rest
  } = props

  return (
    <Paper {...rest}>
      {children}
      {rootInjection}
    </Paper>
  )
}
