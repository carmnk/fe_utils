import { mdiNoteOutline } from '@mdi/js'
import { appBarDef } from '../AppBar/appBarDef'
import { paperPropsSchema } from './paperPropsRawSchema'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { Paper } from '@mui/material'
import { ComponentDefType } from '../../componentDefType'

export const paperDef = {
  ...appBarDef,
  type: 'Paper' as const,
  icon: mdiNoteOutline,
  props: {
    sx: {},
    children: [],
  },

  formGen: ({ editorState }) =>
    propertyFormFactory(paperPropsSchema, editorState),
  category: 'surface',
  schema: paperPropsSchema,
  component: Paper,
} satisfies ComponentDefType
