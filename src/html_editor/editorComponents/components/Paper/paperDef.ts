import { mdiNoteOutline } from '@mdi/js'
import { appBarDef } from '../AppBar/appBarDef'
import { paperPropsSchema } from './paperPropsRawSchema'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { Paper } from '@mui/material'

export const paperDef = {
  ...appBarDef,
  type: 'Paper' as const,
  icon: mdiNoteOutline,
  props: {
    sx: {},
    children: [],
  },

  formGen: ({ editorState }: any) =>
    propertyFormFactory(paperPropsSchema, editorState),
  category: 'surface',
  schema: paperPropsSchema,
  component: Paper,
}
