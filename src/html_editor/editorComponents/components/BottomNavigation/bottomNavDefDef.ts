import { mdiDockBottom } from '@mdi/js'
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
    items: [
      { value: 'item1', label: 'Item 1', isInitialValue: true },
      { value: 'item2', label: 'Item 2' },
    ],
    sx: {},
    slotProps: {
      bottomNavigationAction: {},
    },
  },
  state: 'item1',
  icon: mdiDockBottom,
  category: 'navigation',
  component: BottomNavigationWrapper,
  schema: BottomNavPropsSchema,
  renderType: 'navigation',
} satisfies ElementModel<CBottomNavigationProps & CommonComponentPropertys>
