import { mdiDockBottom } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { BottomNavPropsSchema } from './bottomNavPropsRawSchema'
import { BottomNavigation } from '../../../../components/navigation/BottomNavigation'
import { ComponentDefType } from '../../componentDefType'

export const BottomNavComponentDef: ComponentDefType = {
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
  formGen: ({ editorState }) =>
    propertyFormFactory(BottomNavPropsSchema, editorState),
  //   formGen: ButtonGroupComponentPropsFormFactory,
  icon: mdiDockBottom,
  category: 'navigation',
  component: BottomNavigation,
  schema: BottomNavPropsSchema,
}
