import { useCallback, useMemo } from 'react'
import { ButtonGroup, ButtonGroupProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const ButtonGroupWrapper = (
  props: ButtonGroupProps & CommonComponentPropertys
) => {
  const {
    appController,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    assets,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    id,
    items,
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
        if (!item) return item
        const { isInitialValue: _iOut, ...restItem } = item
        return restItem
      }) ?? []
    )
  }, [items])

  return (
    <ButtonGroup
      {...rest}
      value={navValueState}
      onChange={handleChange}
      items={itemsAdjusted}
    />
  )
}
