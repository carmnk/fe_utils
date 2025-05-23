import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { BASE_POINTER_EVENTS } from '../../commonEventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonEventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonEventSchemas/dragEvents'
import { FOCUS_EVENTS } from '../../commonEventSchemas/focusEvents'
import { MOUSE_EVENTS } from '../../commonEventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonEventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonEventSchemas/touchEvents'
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
    ...FOCUS_EVENTS,
  },
}
