import { Stack } from '@mui/material'
import { ReactNode } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'

export type StackWrapperProps = CommonComponentPropertys & {
  children?: ReactNode
  rootInjection: ReactNode
}
export const StackWrapper = (props: StackWrapperProps) => {
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
    <Stack direction="row" {...rest}>
      {children}
      {rootInjection}
    </Stack>
  )
}
