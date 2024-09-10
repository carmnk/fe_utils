import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const treeViewPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    items: {
      type: PropertyType.json,
      required: false,
      form: {
        defaultValue: [],
      },
      // items: [
      //   {
      //     type: PropertyType.Object,
      //     properties: {},
      //   },
      // ],
      label: 'Data',
      category: 'data',
    } as any,
  },
}
