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
    color: {
      type: PropertyType.color,
      category: 'shortcut',
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
      type: PropertyType.String,
      category: 'shortcut',
    },
    // title: {
    //   type: PropertyType.String,
    //   category: 'shortcut',
    //   label: 'title (A11y)',
    // },
    // description: {
    //   type: PropertyType.String,
    //   category: 'shortcut',
    //   label: 'description (A11y)',
    // },

    sx: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
      },
      category: 'customize',
    },
  },
}
