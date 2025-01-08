import { mdiTab } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { TabsPropsSchema } from './tabsPropsRawSchema'
import { CTabsProps } from '../../../../components/navigation/CTabs'
import { ComponentDefType } from '../../componentDefType'
import { TabsWrapper } from './TabsWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

export const TabsComponentDef = {
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
  component: TabsWrapper,
  schema: TabsPropsSchema,
  renderType: 'navigation',
} satisfies ComponentDefType<Omit<CTabsProps, 'ref'> & CommonComponentPropertys>
