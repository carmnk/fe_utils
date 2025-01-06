import { mdiPlusCircleOutline } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { IconPropsSchema } from './iconPropsRawSchema'
import { ComponentDefType } from '../../componentDefType'
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
