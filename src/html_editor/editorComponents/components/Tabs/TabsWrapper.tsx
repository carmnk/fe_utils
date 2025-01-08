import { useCallback } from 'react'
import { CTabsProps, Tabs } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const TabsWrapper = (props: CTabsProps & CommonComponentPropertys) => {
  const { appController, editorStateUi, isProduction, id, onClick, ...rest } =
    props

  const navValueState = (appController?.state?.[id] as string) ?? ''
  const handleChange = useCallback(
    (tabValue: string) => {
      appController.actions.updateProperty(id, tabValue)
    },
    [appController, id]
  )

  return <Tabs {...rest} value={navValueState} onChange={handleChange} />
}
