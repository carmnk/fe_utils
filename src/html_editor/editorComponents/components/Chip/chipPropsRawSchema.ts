import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { ICON_NAMES } from '../../../defs/iconNames'
import { MuiSize } from '../../../defs/muiSizeDict'
import { BASE_POINTER_EVENTS } from '../../eventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../eventSchemas/clipboardEvents'
import { FOCUS_EVENTS } from '../../eventSchemas/focusEvents'
import { KEYBOARD_EVENTS } from '../../eventSchemas/keyboardEvents'
import { MOUSE_EVENTS } from '../../eventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../eventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../eventSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

export const muiBaseColors = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
]
export const muiBaseColorsOptions = muiBaseColors.map((bt) => ({
  value: bt,
  label: bt,
}))
// raw schema to use until schema can be generated reliably from typescript parser/checker
export const chipPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
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
    icon: {
      type: PropertyType.icon,
      required: false,
      enum: ICON_NAMES,
      category: 'shortcut',
    },
    label: {
      type: PropertyType.String,
      form: {
        defaultValue: 'Test Chip',
      },
      category: 'content',
    },
    size: {
      type: PropertyType.String,
      enum: Object.values(MuiSize).filter((size) => size !== 'large'),
      required: false,
      form: {
        defaultValue: MuiSize.medium,
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: ['filled', 'outlined'],
      required: false,
      form: {
        defaultValue: 'filled',
      },
      category: 'shortcut',
    },
    color: {
      // form: {
      // },
      type: PropertyType.String,
      required: false,
      enum: muiBaseColors,
      form: {
        defaultValue: muiBaseColors[0],
      },
      category: 'shortcut',
    },
    clickable: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: true,
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
    skipFocusWhenDisabled: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    // sx: {
    //   type: PropertyType.Object,
    //   required: false,
    //   properties: {},
    // },
    // title: {
    //   type: PropertyType.String,
    //   required: false,
    // },
    // tooltip: {
    //   type: PropertyType.String,
    //   required: false,
    // },
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

    ...BASE_POINTER_EVENTS,
    ...MOUSE_EVENTS,
    ...POINTER_EVENTS,
    ...KEYBOARD_EVENTS, // work only when element is clickable or focusable
    ...TOUCH_EVENTS,
    ...CLIPBOARD_EVENTS,
    ...FOCUS_EVENTS,
  },
}
