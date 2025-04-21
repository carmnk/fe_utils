import { useCallback, useMemo } from 'react'
import { CTabsProps, Tabs } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const TabsWrapper = (props: CTabsProps & CommonComponentPropertys) => {
  const {
    appController,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    assets,
    isProduction,
    id,
    onClick,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    items,
    ...rest
  } = props

  const navValueState =
    (appController?.state?.[id] as string) ??
    items?.find?.((item) => item.isInitialValue)?.value ??
    ''

  const handleChange = useCallback(
    (tabValue: string) => {
      appController.actions.updateProperty(id, tabValue)
    },
    [appController, id]
  )

  const itemsAdjusted = useMemo(() => {
    return (
      items?.map?.((item) => {
        const { isInitialValue: _iOut, ...restItem } = item
        return restItem
      }) ?? []
    )
  }, [items])

  return (
    <Tabs
      {...rest}
      value={navValueState}
      onChange={handleChange}
      items={itemsAdjusted}
    />
  )
}
