import { useCallback, useMemo } from 'react'
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
    items,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    onClick,
    id,
    editorStateUi,
    assets,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

  const navValueState =
    (appController?.state?.[id] as string) ??
    items?.find?.((item) => item?.isInitialValue)?.value ??
    ''
  const handleChange = useCallback(
    (tabValue: string) => {
      appController.actions.updateProperty(id, tabValue)
    },
    [appController, id]
  )

  const itemsAdjusted = useMemo(() => {
    return (
      items?.map((item) => {
        const { isInitialValue: _iOut, ...restItem } = item
        return restItem
      }) ?? []
    )
  }, [items])

  return (
    <BottomNavigation
      {...rest}
      items={itemsAdjusted}
      value={navValueState}
      onChange={handleChange}
    />
  )
}
