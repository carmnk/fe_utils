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
      category: 'customize',
    },
  },
}
