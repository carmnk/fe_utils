import { CommonComponentPropertys } from '../../componentProperty'
import { CTreeView2, CTreeViewProps } from './CTreeView2'
import { useCallback, useMemo } from 'react'
import { Typography } from '@mui/material'

export type TreeViewWrapperProps = CTreeViewProps &
  CommonComponentPropertys & { initialExpanded?: 'all' | 'none' }

export const TreeViewWrapper = (props: TreeViewWrapperProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    appController,
    id,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    editorStateUi,
    assets,
    isProduction,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    initialExpanded,
    items,
    icons,
    ...rest
  } = props

  const treeViewSelectedState = useMemo(
    () => appController?.state?.treeviews?.selectedId[id] ?? {},
    [appController, id]
  )
  const onTreeViewSelectionChange = useCallback(
    (__e: unknown, itemId: string) => {
      const item = Array.isArray(items)
        ? (items?.find((item) => item.itemId === itemId) ?? {})
        : {}

      appController.actions.changeTreeviewSelectedItem(id, itemId, item)
    },
    [appController, id, items]
  )

  const itemWithDuplicateId = items?.find?.((item, iIdx) =>
    items?.find?.((it, iIdx2) => it.itemId === item.itemId && iIdx !== iIdx2)
  )

  const itemsAdj =
    items?.map?.((item) => {
      const icon = item?.labelIcon ?? item?.icon
      // const { onDelete, ...rest } = item
      return {
        ...item,
        labelIcon:
          icon && typeof icon === 'string' && icon.trim().startsWith('mdi')
            ? icons[icon.trim()]
            : icon,
      }
    }) ?? []

  const allExpandedItems = useMemo(() => {
    if (!initialExpanded || initialExpanded === 'none') return undefined
    return items.map((item) => item.itemId)
  }, [initialExpanded, items])

  return !Array.isArray(items) || itemWithDuplicateId ? (
    <Typography>
      Error: The Treeview element expects all items to have a unique{' '}
      <u>itemId</u>
    </Typography>
  ) : (
    <CTreeView2
      {...rest}
      items={itemsAdj}
      selectedItems={treeViewSelectedState}
      onNodeSelect={onTreeViewSelectionChange}
      expandedItems={allExpandedItems}
    />
  )
}
