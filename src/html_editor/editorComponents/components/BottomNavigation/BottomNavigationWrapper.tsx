import { useCallback } from 'react'
import {
  BottomNavigation,
  CBottomNavigationProps,
} from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const BottomNavigationWrapper = (
  props: CBottomNavigationProps & CommonComponentPropertys
) => {
  const { appController, onClick, id, editorStateUi, isProduction, ...rest } =
    props

  const navValueState = (appController?.state?.[id] as string) ?? ''
  const handleChange = useCallback(
    (tabValue: any) => {
      appController.actions.updateProperty(id, tabValue)
    },
    [appController, id]
  )

  return (
    <BottomNavigation {...rest} value={navValueState} onChange={handleChange} />
  )
}
