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
          },
        },
      ],
      form: {
        defaultValue: [{ value: 'test', label: 'test' }],
      },
      category: 'items',
    },
    variant: {
      type: PropertyType.String,
      required: false,
      enum: ['standard', 'scrollable', 'fullWidth'],
      category: 'shortcut',
    },
    component: {
      type: PropertyType.String,
      form: {},
      enum: [],
      groupBy: (item) =>
        item && typeof item === 'object' && 'category' in item
          ? (item?.category as string)
          : undefined,
      category: 'shortcut',
    },

    // textColor: {
    //   type: PropertyType.String,
    //   required: false,
    //   enum: ['inherit', 'primary', 'secondary'],
    //   form: {
    //     defaultValue: 'primary',
    //   },
    // },
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
      enum: ['auto', false, true] as string[],
      category: 'shortcut',
    },
    orientation: {
      type: PropertyType.String,
      required: false,
      enum: ['horizontal', 'vertical'],
      category: 'shortcut',
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
    useTabBorders: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
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

    sx: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      label: 'sx',
      keysDict: CSS_RULE_NAMES_DICT_FULL,
      category: 'customize',
    },
    slotProps: {
      type: PropertyType.Object,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      category: 'customize',
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
