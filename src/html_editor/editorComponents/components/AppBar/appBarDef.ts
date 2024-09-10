import { mdiDockTop } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { appBarPropsSchema } from './appBarPropsRawSchema'
import { AppBarWrapper } from './AppBarWrapper'
import { ComponentDefType } from '../../componentDefType'

export const appBarDef: ComponentDefType = {
  //   ...paperDef,
  type: 'AppBar' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",,
    sx: {},
    children: [],
  },

  formGen: ({ editorState }) =>
    propertyFormFactory(appBarPropsSchema, editorState),
  icon: mdiDockTop,
  category: 'surface',
  schema: appBarPropsSchema,
  component: AppBarWrapper,
}