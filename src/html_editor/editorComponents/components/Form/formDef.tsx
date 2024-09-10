import { mdiListBoxOutline } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { formPropsSchema } from './formPropsRawSchema'
import { GenericForm } from '../../../../components/forms/GenericForm'
import { ComponentDefType } from '../../componentDefType'

export const formEditorComponentDef: ComponentDefType = {
  type: 'Form' as const,

  component: GenericForm,
  formGen: ({ editorState }) =>
    propertyFormFactory(formPropsSchema, editorState, {
      dynamicKeysDict: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fields: (f: any, g: any) => {
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
    fields: [],
  },

  icon: mdiListBoxOutline,
  category: 'data',
  schema: formPropsSchema,
}