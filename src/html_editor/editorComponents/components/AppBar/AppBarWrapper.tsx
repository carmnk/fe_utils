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
    appController,
    editorStateUi,
    isProduction,
    ...rest
  } = props

  const adjustedStyles = useMemo(
    () =>
      (position === 'fixed' || !position) && !isProduction
        ? {
            ...(sx ?? {}),
            top: 42,
            left: editorStateUi.previewMode ? 0 : 364,
            width: editorStateUi.previewMode
              ? '100%'
              : 'calc(100% - 364px - 350px)',
          }
        : {},
    [position, sx, editorStateUi.previewMode, isProduction]
  )

  return (
    <AppBar {...rest} sx={adjustedStyles}>
      {children}
      {rootInjection}
    </AppBar>
  )
}
