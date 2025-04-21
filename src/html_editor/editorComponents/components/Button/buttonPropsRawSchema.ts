import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../../../defs'
import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { ICON_NAMES } from '../../../defs/iconNames'
import { MuiSize } from '../../../defs/muiSizeDict'
import { BASE_POINTER_EVENTS } from '../../commonEventSchemas/basePointerEvents'
import { DRAG_EVENTS } from '../../commonEventSchemas/dragEvents'
import { FOCUS_EVENTS } from '../../commonEventSchemas/focusEvents'
import { KEYBOARD_EVENTS } from '../../commonEventSchemas/keyboardEvents'
import { MOUSE_EVENTS } from '../../commonEventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonEventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonEventSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { muiBaseColors, muiBaseColorsOptions } from '../Chip/chipPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ButtonPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    component: {
      type: PropertyType.String,
      form: {
        defaultValue: 'button',
      },
      enum: HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      groupBy: (item) =>
        item && typeof item === 'object' && 'category' in item
          ? (item?.category as string)
          : undefined,
      category: 'shortcut',
    },
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
      type: PropertyType.color,
      required: false,
      category: 'shortcut',
    },
    fontColor: {
      type: PropertyType.color,
      required: false,
      category: 'shortcut',
    },
    html_id: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    loadingMode: {
      type: PropertyType.String,
      required: false,
      enum: ['auto', 'leftPlaceholder', 'rightPlaceholder'],
      form: {
        defaultValue: 'auto',
      },
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
    disableTabstop: {
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
        defaultValue: true,
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
    },

    slotProps: {
      type: PropertyType.Object,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      category: 'slots',
      properties: {
        startIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        },
        endIcon: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        },
        tooltip: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'sx',
        },
      },
    },
    ...BASE_POINTER_EVENTS,
    ...MOUSE_EVENTS,
    ...POINTER_EVENTS,
    ...KEYBOARD_EVENTS,
    ...TOUCH_EVENTS,
    ...DRAG_EVENTS,
    ...FOCUS_EVENTS,
  },
}
