import { mdiButtonCursor } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonPropsSchema } from './buttonPropsRawSchema'
import { Button } from '../../../../components/buttons/Button'
import { ComponentDefType } from '../../componentDefType'

export const buttonEditorComponentDef = {
  type: 'Button' as const,

  component: Button,
  formGen: ({ editorState }) =>
    propertyFormFactory(ButtonPropsSchema, editorState),
  props: {
    type: 'primary',
    label: 'Test-Label',
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
  state: false,
  icon: mdiButtonCursor,
  category: 'basic',
  schema: ButtonPropsSchema,
} satisfies ComponentDefType
