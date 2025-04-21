import { CommonComponentPropertys } from '../../componentProperty'
// eslint-disable-next-line
import { Dialog, DialogProps } from '@mui/material'
import { useCallback } from 'react'

export type DialogWrapperProps = DialogProps & CommonComponentPropertys
export const DialogWrapper = (props: DialogWrapperProps) => {
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
    onClose,
    ...rest
  } = props
  const openModal = !!appController?.state?.[id]
  const handleToggleOpen = useCallback(
    (open: boolean) => {
      appController.actions.updateProperty(id, !open)
      onClose?.({}, 'backdropClick')
    },
    [appController, id, onClose]
  )

  return (
    <Dialog
      disablePortal={!isProduction ? true : undefined}
      {...rest}
      open={openModal}
      onClose={handleToggleOpen}
    />
  )
}
