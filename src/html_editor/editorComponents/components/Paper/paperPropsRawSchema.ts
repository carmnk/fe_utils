import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs'
import { BASE_POINTER_EVENTS } from '../../eventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../eventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../eventSchemas/dragEvents'
import { FOCUS_EVENTS } from '../../eventSchemas/focusEvents'
import { MOUSE_EVENTS } from '../../eventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../eventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../eventSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const paperPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.children,
      // required: true,
      category: 'shortcut',
    },
    square: {
      type: PropertyType.Boolean,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    elevation: {
      type: PropertyType.Number,
      minimum: 0,
      maximum: 24,
      // required: true,
      form: {
        defaultValue: 1,
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: ['elevation', 'outlined'],
      // required: true,
      form: {
        defaultValue: 'elevation',
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
    // ...KEYBOARD_EVENTS,
    ...CLIPBOARD_EVENTS,
    ...DRAG_EVENTS,
    ...FOCUS_EVENTS,
  },
}
