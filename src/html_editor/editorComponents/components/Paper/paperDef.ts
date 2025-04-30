import { mdiNoteOutline } from '@mdi/js'
import { appBarDef } from '../AppBar/appBarDef'
import { paperPropsSchema } from './paperPropsRawSchema'
import { ElementModel } from '../../componentDefType'
import { PaperWrapper, PaperWrapperProps } from './PaperWrapper'

export const paperDef = {
  ...appBarDef,
  type: 'Paper' as const,
  icon: mdiNoteOutline,
  props: {},
  category: 'surface',
  schema: paperPropsSchema,
  component: PaperWrapper,
} satisfies ElementModel<PaperWrapperProps>
