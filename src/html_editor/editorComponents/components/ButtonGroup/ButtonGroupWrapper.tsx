import { useCallback } from 'react'
import { ButtonGroup, ButtonGroupProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const ButtonGroupWrapper = (
  props: ButtonGroupProps & CommonComponentPropertys
) => {
  const {
    appController,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    isProduction,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    id,
    ...rest
  } = props

  const navValueState = (appController?.state?.[id] as string) ?? ''
  const handleChange = useCallback(
    (tabValue: string) => {
      appController.actions.updateProperty(id, tabValue)
    },
    [appController, id]
  )

  return <ButtonGroup {...rest} value={navValueState} onChange={handleChange} />
}
