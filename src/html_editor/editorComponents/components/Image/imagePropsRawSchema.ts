import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs'
import {
  BASE_POINTER_EVENTS,
  CLIPBOARD_EVENTS,
  FOCUS_EVENTS,
  KEYBOARD_EVENTS,
  MOUSE_EVENTS,
  POINTER_EVENTS,
  TOUCH_EVENTS,
} from '../../commonEventSchemas'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const imagePropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {

    src: {
      type: PropertyType.imageSrc,
      required: false,
      category: 'shortcut',
    },
    width: {
      type: PropertyType.cssSize,
      required: false,
      category: 'shortcut',
    },
    height: {
      type: PropertyType.cssSize,
      required: false,
      category: 'shortcut',
    },
    alt: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
    },
    display: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
      form: {
        defaultValue: 'inline-block',
      },
      enum: [
        'block',
        'inline',
        'flex',
        'grid',
        'inline-block',
        'inline-flex',
        'inline-grid',
      ],
    },
    position: {
      type: PropertyType.String,
      required: false,
      category: 'shortcut',
      form: {
        defaultValue: 'static',
      },
      enum: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
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
    ...KEYBOARD_EVENTS, // work only when element is clickable or focusable
    ...TOUCH_EVENTS,
    ...CLIPBOARD_EVENTS,
    ...FOCUS_EVENTS,
  },
}
