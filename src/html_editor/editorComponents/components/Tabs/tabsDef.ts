import { mdiTab } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { TabsPropsSchema } from './tabsPropsRawSchema'
import { Tabs } from '../../../../components/navigation/CTabs'
import { ComponentDefType } from '../../componentDefType'

export const TabsComponentDef: ComponentDefType = {
  type: 'Tabs' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
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
  state: 'test',
  formGen: ({ editorState }) =>
    propertyFormFactory(TabsPropsSchema, editorState),
  icon: mdiTab,
  category: 'navigation',
  component: Tabs,
  schema: TabsPropsSchema,
}
