import { mdiRectangleOutline } from '@mdi/js'
import { NavContainerComponentPropsFormFactory } from './NavContainerPropFormFactory'

export const navigationContainerDef = {
  type: 'NavContainer' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    // navigationElementId: null,
    children: [],
  },
  formGen: NavContainerComponentPropsFormFactory as any,
  icon: mdiRectangleOutline,
  category: 'navigation',
  schema: null as any,
}
