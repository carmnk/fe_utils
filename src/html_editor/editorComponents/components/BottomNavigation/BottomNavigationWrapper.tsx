import { useCallback } from 'react'
import {
  BottomNavigation,
  CBottomNavigationProps,
} from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const BottomNavigationWrapper = (
  props: CBottomNavigationProps & CommonComponentPropertys
) => {
  const {
    appController,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onClick,
    id,
    editorStateUi,
    isProduction,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

  const navValueState = (appController?.state?.[id] as string) ?? ''
  const handleChange = useCallback(
    (tabValue: string) => {
      appController.actions.updateProperty(id, tabValue)
    },
    [appController, id]
  )

  return (
    <BottomNavigation {...rest} value={navValueState} onChange={handleChange} />
  )
}
