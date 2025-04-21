import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { LAYOUT_ELEMENT_PROPERTIES_SCHEMA } from '../../commonSchemas/layoutElementPropertySchema'
import { BASE_POINTER_EVENTS } from '../../commonEventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonEventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonEventSchemas/dragEvents'
import { MOUSE_EVENTS } from '../../commonEventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonEventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonEventSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { alignButtons, justifyButtons } from '../Stack/stackPropsRawSchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const gridPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.children,
      // required: true,
      category: 'layout',
    },
    ...LAYOUT_ELEMENT_PROPERTIES_SCHEMA,
    gridTemplateColumns: {
      type: PropertyType.cssSizeArray,
      required: false,
      category: 'grid',
      form: {
        // defaultValue: 'flex-start',
      },
    },
    gridTemplateRows: {
      type: PropertyType.cssSizeArray,
      required: false,
      category: 'grid',
      form: {
        // defaultValue: 'flex-start',
      },
    },
    alignItems: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'grid',
      form: {
        defaultValue: 'flex-start',
      },
      iconButtons: alignButtons,
    },
    alignContent: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'grid',
      form: {
        defaultValue: 'flex-start',
      },
      iconButtons: alignButtons,
    },
    justifyContent: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'grid',
      form: {
        defaultValue: 'flex-start',
      },
      iconButtons: justifyButtons,
    },
    justifyItems: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'grid',
      form: {
        defaultValue: 'flex-start',
      },
      iconButtons: justifyButtons.filter((btn) => !btn.value.includes('space')),
    },
    gap: {
      type: PropertyType.cssGap,
      required: false,
      category: 'grid',
      form: {
        defaultValue: 'auto',
      },
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
  },
}
