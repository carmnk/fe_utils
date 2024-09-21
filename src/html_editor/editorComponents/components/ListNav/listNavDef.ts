import { mdiFormatListNumbered } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ListNavPropsSchema } from './listNavPropsRawSchema'
import { ListNavigation } from '../../../../components/navigation/CListNavigation'

export const listNavEditorComponentDef = {
  type: 'ListNavigation' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
    sx: {},
    slotProps: {
      listItem: {},
      listItemButton: {},
      listItemIcon: {},
      listItemText: {},
      icon: {},
    },
  },
  state: 'test',
  formGen: ({ editorState }: any) =>
    propertyFormFactory(ListNavPropsSchema, editorState),

  icon: mdiFormatListNumbered,
  category: 'navigation',
  component: ListNavigation,
  schema: ListNavPropsSchema,
}

// ButtonPropsSchema
