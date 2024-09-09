import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { BASE_POINTER_EVENTS } from '../../commonSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonSchemas/dragEvents'
import { FOCUS_EVENTS } from '../../commonSchemas/focusEvents'
import { KEYBOARD_EVENTS } from '../../commonSchemas/keyboardEvents'
import { MOUSE_EVENTS } from '../../commonSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { paperPropsSchema } from '../Paper/paperPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const appBarPropsSchema: ExtendedObjectSchemaType = {
  ...paperPropsSchema,
  properties: {
    ...Object.keys(paperPropsSchema.properties)?.reduce((acc, cur) => {
      const addObj =
        paperPropsSchema.properties[cur]?.category !== 'customize'
          ? {
              [cur]: paperPropsSchema.properties[cur],
            }
          : {}

      return { ...acc, ...addObj }
    }, {}),
    position: {
      type: PropertyType.String,
      enum: ['fixed', 'absolute', 'sticky', 'static', 'relative'],
      required: false,
      form: {
        defaultValue: 'fixed',
      },
      category: 'shortcut',
    },
    enableColorOnDark: {
      type: PropertyType.Boolean,
      required: false,
      category: 'shortcut',
    },
    color: {
      type: PropertyType.String,
      required: false,
      enum: [
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
        'error',
        'info',
        'success',
        'warning',
      ],
      form: {
        defaultValue: 'primary',
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
    ...BASE_POINTER_EVENTS,
    ...MOUSE_EVENTS,
    ...POINTER_EVENTS,
    ...TOUCH_EVENTS,
    // ...KEYBOARD_EVENTS,
    ...CLIPBOARD_EVENTS,
    ...DRAG_EVENTS,
    ...FOCUS_EVENTS,
  },
}
