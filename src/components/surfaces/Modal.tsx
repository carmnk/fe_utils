import { ReactNode, useCallback, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import Dialog, { DialogProps } from '@mui/material/Dialog'
import DialogActions, { DialogActionsProps } from '@mui/material/DialogActions'
import DialogContent, { DialogContentProps } from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { Box, BoxProps, PaperProps, Stack, StackProps } from '@mui/material'
import { Tooltip, TooltipProps } from '@mui/material'
import { Typography, TypographyProps } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { Button } from '../buttons/Button'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import { IconProps } from '@mdi/react/dist/IconProps'
import { Flex, FlexProps } from '../_wrapper'
import { NewlineText } from '../basics/NewLineText'
import { CButtonProps } from '../buttons/Button'

const actionsStyles = { pl: 3 }

export type CModalBaseProps = Omit<
  DialogProps,
  'open' | 'onClose' | 'maxWidth' | 'PaperProps' | 'slotProps'
> & {
  buttonBorderRadiuses?: number
  borderRadius?: number
  open: boolean
  header: ReactNode
  isConfirmation?: boolean
  onConfirm?: (data?: unknown) => void
  confirmationIcon?: ReactNode
  confirmationDisabled?: boolean
  confirmationLabel?: string
  cancelConfirmationLabel?: string
  cancelConfirmationIcon?: ReactNode
  onClose?: () => void
  maxWidth?: number
  width?: number
  onSecondaryAction?: () => void
  secondaryActionLabel?: string
  secondaryActionIcon?: ReactNode
  placeNonConfirmationButtonOnLeft?: boolean
  nonConfirmationLabel?: string
  minHeight?: string | number
  disableCloseOnConfirmation?: boolean
  hideConfirmationButton?: boolean
  minWidth?: string | number
  height?: string | number
  loading?: boolean
  subheader?: ReactNode
  confirmationTooltip?: string
  disableTopRightCloseButton?: boolean
  slotProps?: DialogProps['slotProps'] & {
    paper?: PaperProps
    cancelConfirmButton?: CButtonProps
    confirmButton?: CButtonProps
    secondaryButton?: CButtonProps
    nonConfirmationButton?: CButtonProps
    dialogContainertransition?: TransitionProps
    headerFlexContainer?: FlexProps
    headerLeftSubcontainer?: BoxProps
    headerLeftSubcontainerSubheader?: BoxProps
    subheaderTypography?: TypographyProps
    closeButtonContainer?: BoxProps
    closeButton?: CButtonProps
    closeIcon?: IconProps
    dialogTitleTypography?: TypographyProps
    dialogContent?: DialogContentProps
    dialogContentText?: BoxProps
    dialogActionsRoot?: DialogActionsProps
    dialogActionsContainer?: StackProps
    dialogLeftActionsContainer?: StackProps
    closButtonTooltip?: TooltipProps
    dialogContentTypography?: TypographyProps
  }
}

export type CModalProps =
  | (CModalBaseProps & {
      content: ReactNode
    })
  | (CModalBaseProps & {
      children: ReactNode
    })

export const Modal = (props: CModalProps) => {
  const {
    open,
    maxWidth,
    width,
    minHeight,
    minWidth,
    height,
    onClose,
    children,
    // content
    loading,
    header,
    subheader,
    content,
    disableCloseOnConfirmation,
    hideConfirmationButton,
    placeNonConfirmationButtonOnLeft,
    isConfirmation,
    // buttons
    confirmationLabel,
    confirmationTooltip,
    confirmationDisabled,
    confirmationIcon,
    onConfirm,
    cancelConfirmationIcon,
    cancelConfirmationLabel,
    secondaryActionIcon,
    secondaryActionLabel,
    onSecondaryAction,
    nonConfirmationLabel,
    slotProps,
    borderRadius,
    buttonBorderRadiuses,
    disableTopRightCloseButton,
    ...rest
  } = {
    ...props,
    content: 'content' in props ? props.content : undefined,
    children: 'children' in props ? props.children : undefined,
  }

  const {
    paper,
    confirmButton,
    cancelConfirmButton,
    nonConfirmationButton,
    secondaryButton,
    dialogContainertransition,
    headerFlexContainer,
    headerLeftSubcontainer,
    headerLeftSubcontainerSubheader,
    subheaderTypography,
    closeButtonContainer,
    closeButton,
    closeIcon,
    dialogTitleTypography,
    dialogContent,
    dialogContentText,
    dialogActionsRoot,
    dialogActionsContainer,
    dialogLeftActionsContainer,
    closButtonTooltip,
    dialogContentTypography,
    ...muiSlotProps
  } = slotProps ?? {}

  const handleConfirm = useCallback(() => {
    onConfirm?.()
    if (!disableCloseOnConfirmation) onClose?.()
  }, [onConfirm, onClose, disableCloseOnConfirmation])

  const PaperPropsAdj = useMemo(
    () => ({
      ...paper,
      sx: {
        p: 2,
        borderRadius: borderRadius ? borderRadius + 'px' : undefined,
        maxWidth,
        width: width ? width + 4 * 8 : undefined,
        ...paper?.sx,
        minHeight,
        minWidth,
        height,
        maxHeight: '90%',
      },
    }),
    [paper, maxWidth, width, minHeight, minWidth, height, borderRadius]
  )

  const contentInternal = children || content
  const contentComponent = useMemo(
    () =>
      contentInternal && typeof contentInternal === 'string' ? (
        <Typography
          sx={{ lineHeight: '1.25rem' }}
          variant="body2"
          color="text.secondary"
          {...dialogContentTypography}
        >
          <NewlineText text={contentInternal} />
        </Typography>
      ) : (
        contentInternal
      ),
    [contentInternal, dialogContentTypography]
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={
        'modal-' + (typeof header === 'string' ? header : 'generic')
      }
      // aria-describedby="alert-dialog-description"
      PaperProps={PaperPropsAdj}
      {...rest}
      TransitionProps={dialogContainertransition}
      slotProps={muiSlotProps}
    >
      <Flex justifyContent="space-between" {...headerFlexContainer}>
        <Box flexGrow={1} mt={0} {...headerLeftSubcontainer}>
          <Typography
            variant="h6"
            pl={3}
            flexGrow={1}
            py={1}
            {...dialogTitleTypography}
          >
            {header}
          </Typography>
          {subheader && (
            <Box px={3} {...headerLeftSubcontainerSubheader}>
              <Typography {...subheaderTypography}>{subheader}</Typography>
            </Box>
          )}
        </Box>
        {!disableTopRightCloseButton && (
          <Tooltip arrow title={'close'} placement="top" {...closButtonTooltip}>
            <Box {...closeButtonContainer}>
              <Button
                iconButton
                icon={mdiClose}
                onClick={onClose}
                variant="text"
                borderRadius={buttonBorderRadiuses}
                {...closeButton}
              >
                <Icon path={mdiClose} size={1} {...closeIcon} />
              </Button>
            </Box>
          </Tooltip>
        )}
      </Flex>
      <DialogContent {...dialogContent}>
        {typeof contentComponent === 'string' ? (
          <Box component="div" {...dialogContentText}>
            {contentComponent}
          </Box>
        ) : (
          contentComponent
        )}
      </DialogContent>
      <DialogActions sx={actionsStyles} {...dialogActionsRoot}>
        {isConfirmation ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            {...dialogActionsContainer}
          >
            <Button
              variant="text"
              onClick={onClose}
              icon={cancelConfirmationIcon}
              loading={loading}
              borderRadius={buttonBorderRadiuses}
              {...cancelConfirmButton}
            >
              {cancelConfirmationLabel ?? 'Close'}
            </Button>
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
              {...dialogLeftActionsContainer}
            >
              {onSecondaryAction && secondaryActionLabel && (
                <Button
                  variant="outlined"
                  onClick={onSecondaryAction}
                  icon={secondaryActionIcon}
                  loading={loading}
                  borderRadius={buttonBorderRadiuses}
                  {...secondaryButton}
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
                  borderRadius={buttonBorderRadiuses}
                  {...confirmButton}
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
              borderRadius={buttonBorderRadiuses}
              {...nonConfirmationButton}
            >
              {nonConfirmationLabel || 'Close'}
            </Button>
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  )
}
