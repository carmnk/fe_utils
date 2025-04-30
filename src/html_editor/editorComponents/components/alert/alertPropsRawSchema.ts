import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const AlertPropsSchema: ExtendedObjectSchemaType = {
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
    title: {
      type: PropertyType.String,
      category: 'shortcut',
      form: {
        defaultValue: 'Dialog-Title',
      },
    },
    text: {
      type: PropertyType.String,
      category: 'shortcut',
    },
    rightButtonLabel: {
      type: PropertyType.String,
      category: 'shortcut',
    },
    leftButtonLabel: {
      type: PropertyType.String,
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
        dialogTitle: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        },
        dialogContent: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        },
        dialogContentText: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        },
        dialogActions: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        },
        leftButton: {
          type: PropertyType.json,
          form: {
            defaultValue: {},
            // label: 'sx',
          },
          label: 'tabItemContainer',
        },
        rightButton: {
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
    onConfirm: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'events',
      eventType: 'dialogEvent',
    },
  },
}
