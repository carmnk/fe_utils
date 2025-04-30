import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { BASE_POINTER_EVENTS } from '../../commonEventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonEventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonEventSchemas/dragEvents'
import { MOUSE_EVENTS } from '../../commonEventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonEventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonEventSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { LAYOUT_ELEMENT_PROPERTIES_SCHEMA } from '../../commonSchemas/layoutElementPropertySchema'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const boxPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.children,
      // required: true,
      category: 'layout',
    },
    ...LAYOUT_ELEMENT_PROPERTIES_SCHEMA,
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

    ...BASE_POINTER_EVENTS,
    ...MOUSE_EVENTS,
    ...POINTER_EVENTS,
    ...TOUCH_EVENTS,
    ...CLIPBOARD_EVENTS,
    ...DRAG_EVENTS,
  },
}
