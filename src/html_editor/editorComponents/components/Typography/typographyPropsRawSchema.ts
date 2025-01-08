import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { BASE_POINTER_EVENTS } from '../../eventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../eventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../eventSchemas/dragEvents'
import { MOUSE_EVENTS } from '../../eventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../eventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../eventSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

export const muiTypographyColors = [
  'primary',
  'secondary',
  'error',
  'warning.main',
  'info.main',
  'success.main',
  'text.primary',
  'text.secondary',
  'text.disabled',
  'text.hint',
  'divider',
  'action.active',
  'inherit',
  // 'action.hover',
]

const typographyVariants = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body1',
  'body2',
  'subtitle1',
  'subtitle2',
  'caption',
  'button',
  'overline',
  'inherit',
]

const typographyAligns = ['inherit', 'left', 'center', 'right', 'justify']
// const components = HTML_TAG_NAMES_STRUCTURED_OPTIONS

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const typographyPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.String,
      form: {
        defaultValue: 'Test Typography',
      },
      category: 'content',
    },
    component: {
      type: PropertyType.String,
      form: {},
      enum: [],
      groupBy: (item) =>
        item && typeof item === 'object' && 'category' in item
          ? (item?.category as string)
          : undefined,
      category: 'shortcut',
    },
    noWrap: {
      type: PropertyType.Boolean,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    align: {
      type: PropertyType.String,
      enum: typographyAligns,
      form: {
        defaultValue: 'inherit',
      },
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: typographyVariants,
      form: {
        defaultValue: 'body1',
      },
      category: 'shortcut',
    },
    color: {
      // form: {
      // },
      type: PropertyType.String,
      enum: muiTypographyColors,

      // load dynamically!
      // form: {
      //   defaultValue: 'inherit',
      // },
      category: 'shortcut',
    },
    sx: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
        // label: 'sx',
      },
      label: 'sx',
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
