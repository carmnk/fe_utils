import { MouseEvent, useCallback } from 'react'
import { Button, CButtonProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const ButtonWrapper = (
  props: CButtonProps & CommonComponentPropertys
) => {
  const {
    appController,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    isProduction,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    id,
    onClick,
    ...rest
  } = props

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
