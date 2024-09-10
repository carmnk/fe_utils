import { PropertyType, ExtendedObjectSchemaType } from '@cmk/fe_utils'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const treeViewPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    data: {
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

    loading: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
  },
}
