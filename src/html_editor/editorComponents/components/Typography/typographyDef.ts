import { mdiFormatText } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { typographyPropsSchema } from './typographyPropsRawSchema'
import { TypographyWrapper } from './TypographyWrapper'
import { ComponentDefType } from '../../componentDefType'

export const typographyEditorComponentDef = {
  type: 'Typography' as const,
  props: {
    children: 'test',
    noWrap: false,
    align: 'inherit',
    variant: 'body1',
    sx: {},
  },
  formGen: ({ editorState }: any) =>
    propertyFormFactory(typographyPropsSchema, editorState),

  icon: mdiFormatText,
  category: 'basic',
  component: TypographyWrapper,
  schema: typographyPropsSchema,
}
//
