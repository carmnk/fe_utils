import { mdiListBoxOutline } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { formPropsSchema } from './formPropsRawSchema'
import { GenericForm } from '../../../../components/forms/GenericForm'
import { ComponentDefType } from '../../componentDefType'
import { GenericFormProps } from '../../../../components'

export const formEditorComponentDef = {
  type: 'Form' as const,

  component: GenericForm,
  formGen: ({ editorState }) =>
    propertyFormFactory(formPropsSchema, editorState, {
      dynamicKeysDict: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fields: () => {
          // formdata can be parameter
          return [
            {
              name: '',
              label: '',
              type: 'text',
              sx: {},
              width12: 12,
              fillWidth: true,
              required: false,
              disabled: false,
              disableHelperText: false,
              disableLabel: false,
              tooltip: '',
              placeholder: '',
            },
          ]
        },
      },
    }),
  props: {
    fields: [
      {
        name: 'test',
        label: 'Test',
        type: 'text',
        sx: {},
        width12: 12,
        fillWidth: true,
        required: false,
        disabled: false,
        disableHelperText: false,
        disableLabel: false,
        tooltip: 'TEST Tooltip',
        placeholder: 'place me here',
      },
    ],
  },

  icon: mdiListBoxOutline,
  category: 'data',
  schema: formPropsSchema,
  renderType: 'form',
} satisfies ComponentDefType<GenericFormProps>
