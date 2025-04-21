import { Button, CButtonProps } from '../../../../components/buttons/Button'
import { CommonComponentPropertys } from '../../componentProperty'

import {
  // eslint-disable-next-line
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogContentProps,
  DialogContentText,
  DialogContentTextProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
} from '@mui/material'
import { useCallback, useMemo } from 'react'

export type AlertWrapperProps = Omit<DialogProps, 'slotProps'> &
  CommonComponentPropertys & {
    title?: string
    text?: string
    leftButtonLabel?: string
    rightButtonLabel?: string
    onConfirm: () => void
    slotProps?: DialogProps['slotProps'] & {
      dialogTitle?: DialogTitleProps
      dialogContent?: DialogContentProps
      dialogContentText?: DialogContentTextProps
      dialogActions?: DialogActionsProps
      leftButton?: CButtonProps
      rightButton?: CButtonProps
    }
    disableAutoFocus?: boolean
  }
export const AlertWrapper = (props: AlertWrapperProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    appController,
    id,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    assets,
    icons,
    isProduction,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    onConfirm,
    title,
    text,
    leftButtonLabel,
    rightButtonLabel,
    slotProps,
    disableAutoFocus,
    onClose,
    ...rest
  } = props

  const openModal = !!appController?.state?.[id]

  const {
    dialogTitle,
    dialogContent,
    dialogContentText,
    dialogActions,
    leftButton,
    rightButton,
    ...dialogSlotPropsIn
  } = slotProps ?? {}

  const handleToggleOpen = useCallback(
    (newOpenState: boolean) => {
      appController.actions.updateProperty(id, newOpenState)
      if (!newOpenState) {
        onClose?.({}, 'backdropClick')
      }
    },
    [appController, id, onClose]
  )
  const handleClose = useCallback(() => {
    handleToggleOpen(false)
  }, [handleToggleOpen])

  const handleConfirm = useCallback(() => {
    onConfirm?.()
    handleToggleOpen?.(false)
  }, [onConfirm, handleToggleOpen])

  const dialogActionsSx = useMemo(() => {
    return { justifyContent: 'space-between', ...(dialogActions?.sx ?? {}) }
  }, [dialogActions?.sx])

  const rightButtonSx = useMemo(() => {
    return {
      ml: '0 !important',
      ...(rightButton?.sx ?? {}),
    }
  }, [rightButton?.sx])

  return (
    <Dialog
      disablePortal={!isProduction ? true : undefined}
      {...rest}
      open={openModal}
      onClose={handleClose}
      slotProps={dialogSlotPropsIn}
      disableAutoFocus={disableAutoFocus}
    >
      <DialogTitle id="alert-dialog-title" {...dialogTitle}>
        {title ?? 'Dialog-Title'}
      </DialogTitle>
      <DialogContent {...dialogContent}>
        <DialogContentText id="alert-dialog-description" {...dialogContentText}>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={dialogActionsSx} {...dialogActions}>
        <Button variant="text" onClick={handleClose} {...leftButton}>
          {leftButtonLabel ?? 'Close'}
        </Button>
        <Button
          onClick={handleConfirm}
          autoFocus={!disableAutoFocus}
          sx={rightButtonSx}
          {...rightButton}
        >
          {rightButtonLabel ?? 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
