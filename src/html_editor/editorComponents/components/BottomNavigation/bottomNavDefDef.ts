import { mdiDockBottom } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { BottomNavPropsSchema } from './bottomNavPropsRawSchema'
import { BottomNavigation } from '../../../../components/navigation/BottomNavigation'

export const BottomNavComponentDef = {
  type: 'BottomNavigation' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
    sx: {},
    slotProps: {
      bottomNavigationAction: {},
    },
  },
  state: 'test',
  formGen: ({ editorState }: any) =>
    propertyFormFactory(BottomNavPropsSchema, editorState),
  icon: mdiDockBottom,
  category: 'navigation',
  component: BottomNavigation,
  schema: BottomNavPropsSchema,
}
