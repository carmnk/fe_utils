import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const formPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    fields: {
      type: PropertyType.json,
      label: 'fields',
      // keysDict: {
      //   name: '',
      //   label: '',
      //   type: 'text',
      // },
      items: [
        {
          type: PropertyType.Object,
          properties: {
            label: {
              type: PropertyType.String,
              required: true,
              form: {
                showInArrayList: true,
                defaultValue: '',
              },
            },
          },
        },
      ],
      category: 'data',
      form: {
        defaultValue: [],
      },
    },
    showError: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableTopSpacing: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableUseFormElement: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    useChangeCompleted: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableInitialArrayDivider: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    onChangeFormData: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'events',
      eventType: 'form',
    },
    formData: {
      type: PropertyType.json,
      required: false,
      category: 'data',
      form: {
        defaultValue: {},
      },
    },
  },
}
