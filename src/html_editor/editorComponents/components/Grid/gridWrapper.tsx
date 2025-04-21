import { Box } from '@mui/material'
import { ReactNode } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'

export type GridWrapperProps = CommonComponentPropertys & {
  children?: ReactNode
  rootInjection: ReactNode
}
export const GridWrapper = (props: GridWrapperProps) => {
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
    ...rest
  } = props

  return (
    <Box display="grid" {...rest}>
      {children}
      {rootInjection}
    </Box>
  )
}
