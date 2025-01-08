import { mdiRectangleOutline } from '@mdi/js'
import { NavContainerComponentPropsFormFactory } from './NavContainerPropFormFactory'
import { ComponentDefType } from '../../componentDefType'
import { ExtendedObjectSchemaType } from '../../schemaTypes'
import { NavContainerWrapper } from './NavigationContainerWrapper'
import { NavContainerComponentPropertys } from '../../componentProperty'

export const navigationContainerDef = {
  type: 'NavContainer' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    // navigationElementId: null,
    children: [],
  },
  formGen: NavContainerComponentPropsFormFactory,
  icon: mdiRectangleOutline,
  category: 'navigation',
  schema: null as unknown as ExtendedObjectSchemaType,
  component: NavContainerWrapper,
  renderType: 'custom',
} satisfies ComponentDefType<NavContainerComponentPropertys>
