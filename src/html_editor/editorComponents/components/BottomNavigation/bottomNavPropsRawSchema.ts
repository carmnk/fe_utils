import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../../../defs'
import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { ICON_NAMES } from '../../../defs/iconNames'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const BottomNavPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    items: {
      type: PropertyType.Array,
      items: [
        {
          type: PropertyType.Object,
          properties: {
            label: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
            value: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
            icon: { type: PropertyType.icon, enum: ICON_NAMES },
            isInitialValue: {
              type: PropertyType.Boolean,
              form: { showInArrayList: true },
            },
          },
        },
      ],
      form: {
        defaultValue: [
          { value: 'item1', label: 'Item 1', isInitialValue: true },
          { value: 'item2', label: 'Item 2' },
        ],
      },
      category: 'items',
    },
    component: {
      type: PropertyType.String,
      enum: HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      groupBy: (item) =>
        item && typeof item === 'object' && 'category' in item
          ? (item?.category as string)
          : undefined,
      category: 'shortcut',
      form: {
        defaultValue: 'div',
      },
    },
    showLabels: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: true,
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
    sx: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
        label: 'allProps.sx (styles)',
      },
      keysDict: CSS_RULE_NAMES_DICT_FULL,
      category: 'customize',
    },

    slotProps: {
      type: PropertyType.Object,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      category: 'slots',
      properties: {
        bottomNavigationAction: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          // label: 'sx',
        },
        bottomNavigationSelectedAction: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          // label: 'sx',
        },
      },
    },
  },
}
