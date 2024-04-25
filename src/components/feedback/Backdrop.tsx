import { ReactNode, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Backdrop as MuiBackdrop, CircularProgress } from '@mui/material'
import { Stack, Theme, Typography, useTheme, Portal } from '@mui/material'

export type CBackdropProps = {
  open: boolean
  label?: ReactNode
}

export const Backdrop = (props: CBackdropProps) => {
  const { label, open } = props

  const theme = useTheme()
  const backdropStyles = useMemo(() => {
    return {
      color: theme.palette.primary.main,
      zIndex: (theme: Theme) => theme.zIndex.drawer + 10000,
    }
  }, [theme])

  return (
    !!open && (
      <Portal>
        <MuiBackdrop sx={backdropStyles} open={open}>
          <Stack alignItems="center" justifyContent="center" textAlign="center">
            <CircularProgress color="inherit" />
            {label && <Typography> {label}</Typography>}
          </Stack>
        </MuiBackdrop>
      </Portal>
    )
  )
}
