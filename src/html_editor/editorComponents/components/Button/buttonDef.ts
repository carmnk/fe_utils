import { mdiButtonCursor } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonPropsSchema } from './buttonPropsRawSchema'
import { Button } from '../../../../components/buttons/Button'

export const buttonEditorComponentDef = {
  type: 'Button' as const,

  component: Button,
  formGen: ({ editorState }: any) =>
    propertyFormFactory(ButtonPropsSchema, editorState),
  props: {
    type: 'primary',
    label: 'test2324____r',
    disabled: false,
    loading: false,
    iconButton: false,
    size: 'medium',
    sx: {},
    slotProps: {
      typography: {},
      startIcon: {},
      endIcon: {},
      tooltip: {},
    },
  },

  icon: mdiButtonCursor,
  category: 'basic',
  schema: ButtonPropsSchema,
}
