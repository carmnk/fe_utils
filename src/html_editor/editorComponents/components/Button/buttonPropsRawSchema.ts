import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { ICON_NAMES } from '../../../defs/iconNames'
import { MuiSize } from '../../../defs/muiSizeDict'
import { BASE_POINTER_EVENTS } from '../../commonSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonSchemas/dragEvents'
import { FOCUS_EVENTS } from '../../commonSchemas/focusEvents'
import { KEYBOARD_EVENTS } from '../../commonSchemas/keyboardEvents'
import { MOUSE_EVENTS } from '../../commonSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { muiBaseColors, muiBaseColorsOptions } from '../Chip/chipPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ButtonPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    component: {
      type: PropertyType.String,
      form: {},
      enum: [],
      groupBy: (item: any) => item?.category,
      category: 'shortcut',
    } as any,
    label: {
      type: PropertyType.String,
      required: false,
      form: {
        defaultValue: 'TestButton',
      },
      category: 'content',
    },
    color: {
      type: PropertyType.String,
      required: false,
      enum: muiBaseColors,
      form: {
        defaultValue: muiBaseColorsOptions[0],
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: ['contained', 'outlined', 'text'],
      required: false,
      form: {
        defaultValue: 'contained',
      },
      category: 'shortcut',
    },
    size: {
      type: PropertyType.String,
      enum: Object.values(MuiSize),
      required: false,
      form: {
        defaultValue: MuiSize.medium,
      },
      category: 'shortcut',
    },
    name: { type: PropertyType.String, required: false, category: 'shortcut' },
    title: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    tooltip: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    href: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },

    icon: {
      type: PropertyType.icon,
      required: false,
      enum: ICON_NAMES,
      category: 'shortcut',
    },
    endIcon: {
      type: PropertyType.icon,
      required: false,
      enum: ICON_NAMES,
      category: 'shortcut',
    },
    iconColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    fontColor: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    iconButton: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disabled: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableHover: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableTabStop: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    loading: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableInteractiveTooltip: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableTooltipWhenDisabled: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableElevation: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableRipple: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableFocusRipple: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    fullWidth: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
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
    } as any,

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
          label: 'sx',
        } as any,
        startIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        endIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        loadingIconContainer: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        loadingProgress: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
        tooltip: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        } as any,
      },

      // keysDict: CSS_RULE_NAMES_DICT_FULL,
    },

    // children: {
    //   type: PropertyType.String,
    //   required: true,
    // },
    ...BASE_POINTER_EVENTS,
    ...MOUSE_EVENTS,
    ...POINTER_EVENTS,
    ...KEYBOARD_EVENTS,
    ...TOUCH_EVENTS,
    ...DRAG_EVENTS,
    ...FOCUS_EVENTS,

    // ...CLIPBOARD_EVENTS,
  },
}
