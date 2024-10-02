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
    } as any,
  },
}
