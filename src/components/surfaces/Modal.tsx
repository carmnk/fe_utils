// eslint-disable-next-line no-restricted-imports
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { Button } from '../buttons/Button'
import {
  Box,
  IconButton,
  PaperProps,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import { NewlineText } from '../basics/NewLineText'
import { useCallback, useMemo } from 'react'
import { CButtonProps } from '../buttons/Button'

const actionsStyles = { pl: 3 }

export type CModalBaseProps = Omit<
  DialogProps,
  'open' | 'onClose' | 'maxWidth'
> & {
  open: boolean
  header: React.ReactNode
  isConfirmation?: boolean
  onConfirm?: (data?: any) => void
  confirmationIcon?: React.ReactNode
  confirmationDisabled?: boolean
  confirmationLabel?: string
  cancelConfirmationLabel?: string
  cancelConfirmationIcon?: React.ReactNode
  onClose?: (param?: any) => any

  PaperProps?: PaperProps
  maxWidth?: number
  width?: number
  onSecondaryAction?: () => void
  secondaryActionLabel?: string
  secondaryActionIcon?: React.ReactNode
  placeNonConfirmationButtonOnLeft?: boolean
  nonConfirmationLabel?: string
  minHeight?: string | number
  disableCloseOnConfirmation?: boolean
  hideConfirmationButton?: boolean
  minWidth?: string | number
  height?: string | number
  loading?: boolean
  subheader?: React.ReactNode
  confirmationTooltip?: string
  confirmButtonProps?: CButtonProps
  secondaryButtonProps?: CButtonProps
  nonConfirmationButtonProps?: CButtonProps
  cancelConfirmButtonProps?: CButtonProps
}

export type CModalProps =
  | (CModalBaseProps & {
      content: React.ReactNode
    })
  | (CModalBaseProps & {
      children: React.ReactNode
    })

export const Modal = (props: CModalProps) => {
  const {
    open,
    header,
    isConfirmation,
    onConfirm,
    content,
    cancelConfirmationLabel,
    confirmationLabel,
    onClose,
    PaperProps,
    maxWidth,
    width,
    onSecondaryAction,
    secondaryActionLabel,
    confirmationIcon,
    secondaryActionIcon,
    cancelConfirmationIcon,
    placeNonConfirmationButtonOnLeft,
    nonConfirmationLabel,
    minHeight,
    children,
    disableCloseOnConfirmation,
    confirmationDisabled,
    hideConfirmationButton,
    minWidth,
    height,
    loading,
    subheader,
    confirmationTooltip,
    confirmButtonProps,
    secondaryButtonProps,
    nonConfirmationButtonProps,
    cancelConfirmButtonProps,
    ...rest
  } = {
    ...props,
    content: 'content' in props ? props.content : undefined,
    children: 'children' in props ? props.children : undefined,
  }

  const handleConfirm = useCallback(() => {
    onConfirm?.()
    if (!disableCloseOnConfirmation) onClose?.()
  }, [onConfirm, onClose, disableCloseOnConfirmation])

  const PaperPropsAdj = useMemo(
    () => ({
      ...PaperProps,
      sx: {
        p: 2,
        maxWidth,
        width: width ? width + 4 * 8 : undefined,
        ...PaperProps?.sx,
        minHeight,
        minWidth,
        height,
        maxHeight: '90%',
      },
    }),
    [PaperProps, maxWidth, width, minHeight, minWidth, height]
  )

  const contentInternal = children || content
  const contentComponent =
    contentInternal && typeof contentInternal === 'string' ? (
      <Typography sx={{ lineHeight: '1.25rem' }}>
        <NewlineText text={contentInternal} />
      </Typography>
    ) : (
      contentInternal
    )

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby={
          'modal-' + (typeof header === 'string' ? header : 'generic')
        }
        aria-describedby="alert-dialog-description"
        PaperProps={PaperPropsAdj}
        {...rest}
      >
        {/* <Box position="absolute" top={3 * 8} right={4 * 8}>

        </Box> */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <div style={{ flexGrow: 1 }}>
            <DialogTitle id="alert-dialog-title" sx={{ flexGrow: 1 }}>
              {header}
            </DialogTitle>
            {subheader && (
              <Box px={3}>
                <Typography>{subheader}</Typography>
              </Box>
            )}
          </div>
          <Tooltip arrow title={'close'} placement="top">
            <div>
              <IconButton onClick={onClose}>
                <Icon path={mdiClose} size={1} />
              </IconButton>
            </div>
          </Tooltip>
        </Stack>
        <DialogContent id={'dialog-scroll-container'}>
          <DialogContentText id="alert-dialog-description" component="div">
            {contentComponent}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={actionsStyles}>
          {isConfirmation ? (
            <Stack
              direction="row"
              justifyContent="space-between"
              width="100%"
              // mt={2}
            >
              <Button
                variant="text"
                onClick={onClose}
                icon={cancelConfirmationIcon}
                loading={loading}
                {...cancelConfirmButtonProps}
              >
                {cancelConfirmationLabel ?? 'Close'}
              </Button>
              <Stack direction="row" gap={2} alignItems="center">
                {onSecondaryAction && secondaryActionLabel && (
                  <Button
                    variant="outlined"
                    onClick={onSecondaryAction}
                    icon={secondaryActionIcon}
                    loading={loading}
                    {...secondaryButtonProps}
                  >
                    {secondaryActionLabel}
                  </Button>
                )}
                {!hideConfirmationButton && (
                  <Button
                    onClick={handleConfirm}
                    icon={confirmationIcon}
                    disabled={confirmationDisabled}
                    loading={loading}
                    tooltip={confirmationTooltip}
                    {...confirmButtonProps}
                  >
                    {confirmationLabel ?? 'Submit'}
                  </Button>
                )}
              </Stack>
            </Stack>
          ) : (
            <Stack
              direction="row"
              width="100%"
              justifyContent={
                placeNonConfirmationButtonOnLeft ? 'flex-start' : 'flex-end'
              }
            >
              <Button
                variant="text"
                onClick={onClose}
                loading={loading}
                {...nonConfirmationButtonProps}
              >
                {nonConfirmationLabel || 'Close'}
              </Button>
            </Stack>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}
export const AlertDialog = (props: CModalProps) => {
  const { width, maxWidth, ...rest } = props
  return <Modal width={788} minWidth={788} {...rest} />
}
