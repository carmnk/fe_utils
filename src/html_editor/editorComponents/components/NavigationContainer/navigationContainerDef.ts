import { mdiRectangleOutline } from '@mdi/js'
import { ElementModel } from '../../componentDefType'
import { NavContainerWrapper } from './NavigationContainerWrapper'
import { NavContainerComponentPropertys } from '../../componentProperty'
import { navigationContainerPropsSchema } from './navigationContainerPropsRawSchema'

export const navigationContainerDef = {
  type: 'NavContainer' as const,
  props: {
    children: [],
  },
  icon: mdiRectangleOutline,
  category: 'navigation',
  schema: navigationContainerPropsSchema,
  component: NavContainerWrapper,
  renderType: 'custom',
} satisfies ElementModel<NavContainerComponentPropertys>
