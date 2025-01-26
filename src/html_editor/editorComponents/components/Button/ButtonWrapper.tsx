import { MouseEvent, useCallback } from 'react'
import { Button, CButtonProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const ButtonWrapper = (
  props: CButtonProps & CommonComponentPropertys
) => {
  const { appController, editorStateUi, isProduction, id, onClick, ...rest } =
    props

  const handleOnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      appController.actions.changeButtonState(id)

      if (onClick && typeof onClick === 'function') {
        onClick(e)
      }
    },
    [onClick, appController, id]
  )

  return <Button {...rest} onClick={handleOnClick} />
}
