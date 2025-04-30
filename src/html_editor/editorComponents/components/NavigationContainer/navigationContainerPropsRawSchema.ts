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
    allProps: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      label: 'allProps',
      // keysDict: CSS_RULE_NAMES_DICT_FULL,
      valueTransformer: (formData: any) => {
        const { allProps, element_id, ...rest } = formData
        return rest
      },
      changeValueToFormDataTransformer: (
        _currentFormData: Record<string, unknown>,
        newValue: unknown
      ) => {
        return newValue
      },
      category: 'customize',
    } as any,
  },
}
