import { mdiPlusCircleOutline } from '@mdi/js'
import { propertyFormFactory } from '@cmk/fe_utils'
import { IconPropsSchema } from './iconPropsRawSchema'
import { ComponentDefType } from '@cmk/fe_utils'
import { IconComponentWrapper } from './IconComponentWrapper'

export const IconComponentDef: ComponentDefType = {
  type: 'Icon' as const,
  props: {
    size: '1rem',
    sx: {},
  },
  //
  formGen: ({ editorState }) =>
    propertyFormFactory(IconPropsSchema, editorState),
  icon: mdiPlusCircleOutline,
  category: 'basic',
  component: IconComponentWrapper,
  schema: IconPropsSchema,
}
