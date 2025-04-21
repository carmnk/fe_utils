import { mdiTab } from '@mdi/js'
import { TabsPropsSchema } from './tabsPropsRawSchema'
import { CTabsProps } from '../../../../components/navigation/CTabs'
import { ElementModel } from '../../componentDefType'
import { TabsWrapper } from './TabsWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

export const TabsComponentDef = {
  type: 'Tabs' as const,
  props: {
    items: [
      { value: 'item1', label: 'Item 1', isInitialValue: true },
      { value: 'item2', label: 'Item 2' },
    ],
    sx: {},
    slotProps: {
      activeTab: {},
      inactiveTabs: {},
      tooltip: {},
      tabItemContainer: {},
      icon: {},
      typography: {},
    },
  },
  state: 'item1',
  icon: mdiTab,
  category: 'navigation',
  component: TabsWrapper,
  schema: TabsPropsSchema,
  renderType: 'navigation',
} satisfies ElementModel<Omit<CTabsProps, 'ref'> & CommonComponentPropertys>
