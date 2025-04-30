import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../../../defs'
import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { ICON_NAMES } from '../../../defs/iconNames'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const TabsPropsSchema: ExtendedObjectSchemaType = {
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
    variant: {
      type: PropertyType.String,
      required: false,
      enum: ['standard', 'scrollable', 'fullWidth'],
      category: 'shortcut',
      form: {
        defaultValue: 'standard',
      },
    },
    tabVariant: {
      type: PropertyType.String,
      required: false,
      enum: ['filled', 'outlined', 'text'],
      category: 'shortcut',
      form: {
        defaultValue: 'filled',
      },
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

    // textColor: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: ['inherit', 'primary', 'secondary'],
    //   form: {
    //     defaultValue: 'primary',
    //   },
    // },
    textColor: {
      type: PropertyType.String,
      required: false,
      enum: ['primary', 'secondary', 'inherit'],
      form: {
        defaultValue: 'inherit',
      },
      category: 'shortcut',
    },
    indicatorColor: {
      type: PropertyType.String,
      required: false,
      enum: ['primary', 'secondary'],
      form: {
        defaultValue: 'primary',
      },
      category: 'shortcut',
    },
    scrollButtons: {
      type: PropertyType.String,
      required: false,
      enum: ['auto', 'false', 'true'] as string[],
      category: 'shortcut',
      form: {
        defaultValue: 'auto',
      },
    },
    orientation: {
      type: PropertyType.String,
      required: false,
      enum: ['horizontal', 'vertical'],
      category: 'shortcut',
      form: {
        defaultValue: 'horizontal',
      },
    },
    disableIndicator: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableBorderBottom: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    centered: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    visibleScrollbar: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    // useTabBorders: {
    //   type: PropertyType.Boolean,
    //   required: false,
    //   category: 'shortcut',
    // },
    allowScrollButtonsMobile: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    selectionFollowsFocus: {
      type: PropertyType.Boolean,
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
        typography: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'typography',
        },
        activeTab: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'activeTab',
        },
        inactiveTabs: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'inactiveTabs',
        },
        tooltip: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tooltip',
        },
        tabItemContainer: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        },
        icon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'icon',
        },
      },
    },
  },
}
