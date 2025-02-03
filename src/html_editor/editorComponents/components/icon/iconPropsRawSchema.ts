import { ICON_NAMES } from '../../../defs/iconNames'
import { PropertyType, ExtendedObjectSchemaType } from '../..'

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
    },
  },
}
