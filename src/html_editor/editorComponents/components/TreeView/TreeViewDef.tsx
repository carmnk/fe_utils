import { mdiTreeOutline } from '@mdi/js'
import { treeViewPropsSchema } from './treeViewPropsRawSchema'
import { CommonComponentPropertys } from '../../componentProperty'
import { CTreeViewProps } from './CTreeView2'
import { TreeViewWrapper } from './TreeViewWrapper'
import { ElementModel } from '../../componentDefType'

export const treeViewDef = {
  type: 'TreeView' as const,
  component: TreeViewWrapper,
  props: {
    items: [
      { itemId: '1', label: 'One' },
      { itemId: '1a', _parentId: '1', label: 'One A' },
      { itemId: '2', label: 'Two' },
    ],
    selectedItems: [],
  },

  icon: mdiTreeOutline,
  category: 'data',
  schema: treeViewPropsSchema,
} satisfies ElementModel<CTreeViewProps & CommonComponentPropertys>
