import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../../../defs'
import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { ICON_NAMES } from '../../../defs/iconNames'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { TYPOGRAPHY_VARIANTS } from '../Typography/typographyPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ListNavPropsSchema: ExtendedObjectSchemaType = {
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
            secondaryLabel: {
              type: PropertyType.String,
              form: { showInArrayList: false },
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
          {
            value: 'item1',
            label: 'Item 1',
            secondaryLabel: 'add a secondaryLabel',
            isInitialValue: true,
          },
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
        defaultValue: 'ul',
      },
    },
    primaryTypographyVariant: {
      type: PropertyType.String,
      required: false,
      enum: TYPOGRAPHY_VARIANTS,
      category: 'shortcut',
      form: {
        defaultValue: 'body1',
      },
    },
    secondaryTypographyVariant: {
      type: PropertyType.String,
      required: false,
      enum: TYPOGRAPHY_VARIANTS,
      category: 'shortcut',
      form: {
        defaultValue: 'body2',
      },
    },
    primaryTypographyColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    secondaryTypographyColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    background: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    itemHoverBgColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    activeItemBgColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    activeItemHoverBgColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },

    dense: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    disablePadding: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    subheader: {
      type: PropertyType.String,
      required: false,
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
        listItem: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItem',
        },
        listItemButton: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemButton',
        },
        listItemIconRoot: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemIcon',
        },
        listItemIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemIcon',
        },
        listItemTextContainer: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemText',
        },
        listItemTextPrimaryTypography: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemText',
        },
        listItemTextSecondaryTypography: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'listItemText',
        },
      },
    },
  },
}
