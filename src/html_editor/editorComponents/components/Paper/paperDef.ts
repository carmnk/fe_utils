import { mdiNoteOutline } from '@mdi/js'
import { appBarDef } from '../AppBar/appBarDef'
import { paperPropsSchema } from './paperPropsRawSchema'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ComponentDefType } from '../../componentDefType'
import { PaperWrapper, PaperWrapperProps } from './PaperWrapper'

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
  component: PaperWrapper,
} satisfies ComponentDefType<PaperWrapperProps>
