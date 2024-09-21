import { mdiDockTop } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { appBarPropsSchema } from './appBarPropsRawSchema'
import { AppBarWrapper } from './AppBarWrapper'

export const appBarDef = {
  //   ...paperDef,
  type: 'AppBar' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",,
    sx: {},
    children: [],
  },

  formGen: ({ editorState }: any) =>
    propertyFormFactory(appBarPropsSchema, editorState),
  icon: mdiDockTop,
  category: 'surface',
  schema: appBarPropsSchema,
  component: AppBarWrapper,
}
