import { ReactNode, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import {
  Backdrop as MuiBackdrop,
  CircularProgress,
  BackdropProps,
} from '@mui/material'
import { Stack, Theme, Typography, useTheme, Portal } from '@mui/material'

export type CBackdropProps = BackdropProps & {
  open: boolean
  label?: ReactNode
  disablePortal?: boolean
}

export const Backdrop = (props: CBackdropProps) => {
  const { label, open, disablePortal, ...rest } = props

  const theme = useTheme()
  const backdropStyles = useMemo(() => {
    return {
      color: theme.palette.primary.main,
      zIndex: (theme: Theme) => theme.zIndex.drawer + 10000,
    }
  }, [theme])

  return (
    !!open && (
      <Portal disablePortal={disablePortal}>
        <MuiBackdrop sx={backdropStyles} open={open} {...rest} >
          <Stack alignItems="center" justifyContent="center" textAlign="center">
            <CircularProgress color="inherit" />
            {label && <Typography> {label}</Typography>}
          </Stack>
        </MuiBackdrop>
      </Portal>
    )
  )
}
