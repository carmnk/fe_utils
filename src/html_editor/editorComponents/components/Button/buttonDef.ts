import { mdiButtonCursor } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonPropsSchema } from './buttonPropsRawSchema'
import { Button } from '../../../../components/buttons/Button'
import { ComponentDefType } from '../../componentDefType'

export const buttonEditorComponentDef: ComponentDefType = {
  type: 'Button' as const,

  component: Button,
  formGen: ({ editorState }) =>
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
