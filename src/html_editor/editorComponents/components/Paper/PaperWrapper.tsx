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
    /* eslint-disable @typescript-eslint/no-unused-vars */
    // sx,
    appController,
    assets,
    editorStateUi,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

  return (
    <Paper {...rest}>
      {children}
      {rootInjection}
    </Paper>
  )
}
