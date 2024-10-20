import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs'
import { BASE_POINTER_EVENTS } from '../../commonSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonSchemas/dragEvents'
import { FOCUS_EVENTS } from '../../commonSchemas/focusEvents'
import { KEYBOARD_EVENTS } from '../../commonSchemas/keyboardEvents'
import { MOUSE_EVENTS } from '../../commonSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonSchemas/touchEvents'
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
