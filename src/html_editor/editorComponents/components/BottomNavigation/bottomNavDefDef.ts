import { mdiDockBottom } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { BottomNavPropsSchema } from './bottomNavPropsRawSchema'
import { CBottomNavigationProps } from '../../../../components/navigation/BottomNavigation'
import { ElementModel } from '../../componentDefType'
import { BottomNavigationWrapper } from './BottomNavigationWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

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
  formGen: ({ editorState }) =>
    propertyFormFactory(BottomNavPropsSchema, editorState),
  icon: mdiDockBottom,
  category: 'navigation',
  component: BottomNavigationWrapper,
  schema: BottomNavPropsSchema,
  renderType: 'navigation',
} satisfies ElementModel<CBottomNavigationProps & CommonComponentPropertys>
