import { ICON_NAMES } from '../../../defs/iconNames'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { buttonEditorComponentDef } from '../Button/buttonDef'
import { muiBaseColors } from '../Chip/chipPropsRawSchema'

/* eslint-disable @typescript-eslint/no-unused-vars */
const {
  icon,
  endIcon,
  onClick,
  onKeyDown,
  onPointerDown,
  title,
  tooltip,
  label,
  name,
  ...buttonSchema
  /* eslint-enable @typescript-eslint/no-unused-vars */
} = buttonEditorComponentDef.schema.properties

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const ButtonGroupPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    // children: {
    //   type: PropertyType.children,
    // },
    items: {
      type: PropertyType.Array,
      items: [
        {
          type: PropertyType.Object,
          properties: {
            label: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
            value: {
              type: PropertyType.String,
              form: { showInArrayList: true },
            },
            icon: { type: PropertyType.icon, enum: ICON_NAMES },
          },
        },
      ],
      form: {
        defaultValue: [
          {
            value: 'item1',
            label: 'Item 1',
            isInitialValue: true,
          },
          { value: 'item2', label: 'Item 2' },
        ],
      },
      category: 'items',
    },
    color: {
      type: PropertyType.String,
      enum: muiBaseColors,
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
    slotProps: {
      type: PropertyType.Object,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      category: 'slots',
      properties: {
        flexContainer: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'flexContainer',
        },
        buttonSlotProps: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'buttonSlotProps',
        },
        selectedButtonSlotProps: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'selectedButtonSlotProps',
        },
        divider: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'divider',
        },
      },
    },
  },
}
