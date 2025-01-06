// import { CSS_RULE_NAMES_DICT_FULL } from '@cmk/fe_utils'
import { ICON_NAMES } from '@cmk/fe_utils'
import { PropertyType, ExtendedObjectSchemaType } from '@cmk/fe_utils'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const IconPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    path: {
      type: PropertyType.icon,
      category: 'shortcut',
      enum: ICON_NAMES,
    },
    size: {
      type: PropertyType.String,
      category: 'shortcut',
    },
    horizontal: {
      type: PropertyType.Boolean,
      category: 'shortcut',
    },
    vertical: {
      type: PropertyType.Boolean,
      category: 'shortcut',
    },
    rotate: {
      type: PropertyType.Number,
      category: 'shortcut',
    },
    spin: {
      type: PropertyType.Number,
      category: 'shortcut',
    },
    title: {
      type: PropertyType.String,
      category: 'shortcut',
    },

    sx: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
      },
      category: 'customize',
    } as any,
  },
}
