import { mdiFormatListNumbered } from '@mdi/js'
import { ListNavPropsSchema } from './listNavPropsRawSchema'
import { ListNavigationProps } from '../../../../components/navigation/CListNavigation'
import { ElementModel } from '../../componentDefType'
import { ListNavWrapper } from './ListNavWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

export const listNavEditorComponentDef = {
  type: 'ListNavigation' as const,
  props: {
    items: [
      {
        value: 'item1',
        label: 'Item 1',
        secondaryLabel: 'add a secondaryLabel',
        isInitialValue: true,
      },
      { value: 'item2', label: 'Item 2' },
    ],
  },
  state: 'item1',
  icon: mdiFormatListNumbered,
  category: 'navigation',
  component: ListNavWrapper,
  schema: ListNavPropsSchema,
  renderType: 'navigation',
} satisfies ElementModel<ListNavigationProps & CommonComponentPropertys>

// ButtonPropsSchema
