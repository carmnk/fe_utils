import { mdiPlusCircleOutline } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { IconPropsSchema } from './iconPropsRawSchema'
import { ElementModel } from '../../componentDefType'
import { IconComponentWrapper } from './IconComponentWrapper'
import { IconComponentWrapperProps } from './IconComponentWrapper'

export const IconComponentDef: ElementModel<IconComponentWrapperProps> = {
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
