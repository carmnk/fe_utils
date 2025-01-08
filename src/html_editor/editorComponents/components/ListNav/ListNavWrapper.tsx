import { useCallback } from 'react'
import { ListNavigation, ListNavigationProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const ListNavWrapper = (
  props: ListNavigationProps & CommonComponentPropertys
) => {
  const { appController, id, editorStateUi, isProduction, ...rest } = props

  const navValueState = (appController?.state?.[id] as string) ?? ''
  const handleChange = useCallback(
    (tabValue: any) => {
      appController.actions.updateProperty(id, tabValue)
    },
    [appController, id]
  )

  return (
    <ListNavigation {...rest} value={navValueState} onChange={handleChange} />
  )
}
