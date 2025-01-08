import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { BASE_POINTER_EVENTS } from '../../eventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../eventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../eventSchemas/dragEvents'
import { FOCUS_EVENTS } from '../../eventSchemas/focusEvents'
import { MOUSE_EVENTS } from '../../eventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../eventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../eventSchemas/touchEvents'
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
    },
    ...BASE_POINTER_EVENTS,
    ...MOUSE_EVENTS,
    ...POINTER_EVENTS,
    ...TOUCH_EVENTS,
    ...CLIPBOARD_EVENTS,
    ...DRAG_EVENTS,
    ...FOCUS_EVENTS,
  },
}
