import { mdiDockTop } from '@mdi/js'
import { appBarPropsSchema } from './appBarPropsRawSchema'
import { AppBarWrapper, AppBarWrapperProps } from './AppBarWrapper'
import { ElementModel } from '../../componentDefType'

export const appBarDef = {
  type: 'AppBar' as const,
  props: {
    sx: {},
    children: [],
  },

  icon: mdiDockTop,
  category: 'surface',
  schema: appBarPropsSchema,
  component: AppBarWrapper,
} satisfies ElementModel<AppBarWrapperProps>
