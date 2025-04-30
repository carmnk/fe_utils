import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../../../defs'
import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { ICON_NAMES } from '../../../defs/iconNames'
import { MuiSize } from '../../../defs/muiSizeDict'
import { BASE_POINTER_EVENTS } from '../../commonEventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonEventSchemas/clipboardEvents'
import { FOCUS_EVENTS } from '../../commonEventSchemas/focusEvents'
import { KEYBOARD_EVENTS } from '../../commonEventSchemas/keyboardEvents'
import { MOUSE_EVENTS } from '../../commonEventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonEventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonEventSchemas/touchEvents'
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
    label: {
      type: PropertyType.String,
      form: {
        defaultValue: 'Test Chip',
      },
      category: 'content',
    },
    icon: {
      type: PropertyType.icon,
      required: false,
      enum: ICON_NAMES,
      category: 'content',
    },
    iconColor: {
      type: PropertyType.color,
      required: false,
      category: 'content',
      form: {
        defaultValue: 'inherit',
      },
    },
    avatarInitials: {
      type: PropertyType.String,
      // form: {
      //   defaultValue: 'Test Chip',
      // },
      category: 'content',
    },
    avatarBgColor: {
      type: PropertyType.color,
      form: {
        defaultValue: 'inherit',
      },
      category: 'content',
    },
    avatarImage: {
      type: PropertyType.imageSrc,
      // form: {
      //   defaultValue: 'inherit',
      // },
      category: 'content',
    },
    deleteIcon: {
      type: PropertyType.icon,
      required: false,
      enum: ICON_NAMES,
      category: 'content',
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
      enum: [...muiBaseColors, 'default'],
      form: {
        defaultValue: 'default',
      },
      category: 'shortcut',
    },
    clickable: {
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
    onDelete: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'events',
      eventType: 'chipEvent',
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
