import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const navigationContainerPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    navigationElementId: {
      type: PropertyType.navControlElementId,
      form: {
        defaultValue: 'body1',
      },
      category: 'shortcut',
    },
    items: {
      type: PropertyType.Array,
      items: [
        {
          type: PropertyType.Object,
          properties: {
            value: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
            childId: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
          },
        },
      ],
      form: {
        defaultValue: [
          {
            value: 'item1',
            label: 'Item 1',
            secondaryLabel: 'add a secondaryLabel',
            isInitialValue: true,
          },
          { value: 'item2', label: 'Item 2' },
        ],
      },
      category: 'shortcut',
    },
  },
}
