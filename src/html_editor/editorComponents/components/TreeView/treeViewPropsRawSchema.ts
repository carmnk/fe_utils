import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { ICON_NAMES } from '../../../defs/iconNames'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const treeViewPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    items: {
      type: PropertyType.Array,
      required: false,
      items: [
        {
          type: PropertyType.Object,
          properties: {
            itemId: {
              type: PropertyType.String,
              required: true,
              form: {
                showInArrayList: true,
              },
            },
            label: {
              type: PropertyType.String,
              required: true,
              form: {
                showInArrayList: true,
              },
            },
            icon: { type: PropertyType.icon, enum: ICON_NAMES },
            _parentId: {
              type: PropertyType.String,
              required: false,
            },
            // children: {
            //   type: PropertyType.Array,
            //   required: false,
            // },
          },
        },
      ],
      form: {
        defaultValue: [
          { itemId: '1', label: 'One' },
          { itemId: '1a', _parentId: '1', label: 'One A' },
          { itemId: '2', label: 'Two' },
        ],
      },
      label: 'items',
      category: 'data',
    },
    aufocus: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },

      category: 'shortcut',
    },
    disableItemsFocusable: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      // label: 'disableItemsFocusable',
      category: 'shortcut',
    },
    enableNullSelection: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },

      category: 'shortcut',
    },
    disableItemDelete: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },

      category: 'shortcut',
    },
    disableItemAdd: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },

      category: 'shortcut',
    },
    width: {
      type: PropertyType.String,
      required: false,
      form: {
        defaultValue: false,
      },

      category: 'shortcut',
    },
    maxWidth: {
      type: PropertyType.String,
      required: false,
      form: {
        defaultValue: false,
      },

      category: 'shortcut',
    },
    initialExpanded: {
      type: PropertyType.String,
      required: false,
      form: {
        defaultValue: 'none',
      },
      enum: ['all', 'none'],

      category: 'shortcut',
    },

    onNodeSelect: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'events',
      eventType: 'item',
    },
    // onNodeToggle: {
    //   type: PropertyType.eventHandler,
    //   required: false,
    //   category: 'events',
    //   eventType: 'item',
    // },
    onNodeAddAction: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'events',
      eventType: 'item',
    },
    onNodeRemoveAction: {
      type: PropertyType.eventHandler,
      required: false,
      category: 'events',
      eventType: 'item',
    },
  },
}
