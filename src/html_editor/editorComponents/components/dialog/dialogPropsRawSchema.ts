import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const DialogPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    open: {
      type: PropertyType.Boolean,
      required: false,

      category: 'shortcut',
    },
    disableEscapeKeyDown: {
      type: PropertyType.Boolean,
      category: 'shortcut',
    },
    fullScreen: {
      type: PropertyType.Boolean,
      category: 'shortcut',
    },
    fullWidth: {
      type: PropertyType.Boolean,
      category: 'shortcut',
    },
    maxWidth: {
      type: PropertyType.String,
      category: 'shortcut',
      enum: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    scroll: {
      type: PropertyType.String,
      category: 'shortcut',
      enum: ['paper', 'body'],
      form: {
        defaultValue: 'paper',
      },
    },

    children: {
      type: PropertyType.children,
      // required: true,
      category: 'shortcut',
    },
    // sx: {
    //   type: PropertyType.json,
    //   form: {
    //     defaultValue: {},
    //     // label: 'sx',
    //   },
    //   label: 'sx',
    //   keysDict: CSS_RULE_NAMES_DICT_FULL,
    //   category: 'customize',
    // },
    slotProps: {
      type: PropertyType.Object,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      category: 'slots',
      properties: {
        root: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tooltip',
        },
        backdrop: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'backdrop',
        },
        container: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'container',
        },
        paper: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'inactiveTabs',
        },
        transition: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        },
      },
    },
    onClose: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'events',
      eventType: 'dialogEvent',
    },
  },
}
