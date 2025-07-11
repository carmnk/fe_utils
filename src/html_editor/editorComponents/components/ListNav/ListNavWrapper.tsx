import { useCallback } from 'react'
import { ListNavigation, ListNavigationProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const ListNavWrapper = (
  props: ListNavigationProps & CommonComponentPropertys
) => {
  const {
    appController,
    id,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    assets,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    onChange,
    ...rest
  } = props

  const navValueState =
    props?.value ??
    (appController?.state?.[id] as string) ??
    rest?.items?.find?.((item) => item?.isInitialValue)?.value ??
    ''
  const handleChange = useCallback(
    (tabValue: string) => {
      appController.actions.updateProperty(id, tabValue)
      onChange?.(tabValue)
    },
    [appController, id, onChange]
  )

  return (
    <ListNavigation onChange={handleChange} {...rest} value={navValueState} />
  )
}
