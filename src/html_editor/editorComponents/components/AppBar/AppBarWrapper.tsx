import { AppBar, AppBarProps } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'

export type AppBarWrapperProps = AppBarProps & {
  rootInjection: ReactNode
} & CommonComponentPropertys

export const AppBarWrapper = (props: AppBarWrapperProps) => {
  const {
    children,
    rootInjection,
    position,
    sx,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    appController,
    editorStateUi,
    assets,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

  const adjustedStyles = useMemo(
    () =>
      // TODO: works only if appbar is not in a container ! -> additional adjustment needed
      (position === 'fixed' || !position) && !isProduction
        ? {
            ...(sx ?? {}),
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }
        : {},
    [position, sx, isProduction]
  )

  return (
    <AppBar {...rest} position={position} sx={adjustedStyles}>
      {children}
      {rootInjection}
    </AppBar>
  )
}
