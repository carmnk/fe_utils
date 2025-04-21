import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../../../defs'
import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { BASE_POINTER_EVENTS } from '../../commonEventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonEventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonEventSchemas/dragEvents'
import { MOUSE_EVENTS } from '../../commonEventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonEventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonEventSchemas/touchEvents'
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

export const TYPOGRAPHY_VARIANTS = [
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
      uiType: 'textarea',
    },

    component: {
      type: PropertyType.String,
      form: {},
      enum: HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      groupBy: (item) =>
        item && typeof item === 'object' && 'category' in item
          ? (item?.category as string)
          : undefined,
      category: 'shortcut',
    },
    variant: {
      type: PropertyType.String,
      enum: TYPOGRAPHY_VARIANTS,
      form: {
        defaultValue: 'body1',
      },
      category: 'shortcut',
    },
    color: {
      type: PropertyType.color,
      // load dynamically!
      form: {
        defaultValue: 'auto',
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
    noWrap: {
      type: PropertyType.Boolean,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    textOverflow: {
      type: PropertyType.String,
      form: {
        defaultValue: 'clip',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: ['clip', 'ellipsis'],
    },
    fontSize: {
      type: PropertyType.cssSize,
      form: {
        defaultValue: 'auto',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
    },
    lineHeight: {
      type: PropertyType.cssSize,
      form: {
        defaultValue: 'auto',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
    },
    fontWeight: {
      type: PropertyType.String,
      form: {
        defaultValue: 'auto',
      },
      category: 'shortcut',
      enum: [
        '100',
        '200',
        '300',
        'normal',
        '500',
        '600',
        'bold',
        '800',
        '900',
        'lighter',
        'bolder',
      ],
    },
    fontStyle: {
      type: PropertyType.String,
      enum: ['normal', 'italic'],
      form: {
        defaultValue: 'normal',
      },
      category: 'shortcut',
    },
    letterSpacing: {
      type: PropertyType.cssSize,
      form: {
        defaultValue: 'auto',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
    },
    wordSpacing: {
      type: PropertyType.cssSize,
      form: {
        defaultValue: 'auto',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
    },
    textIndent: {
      type: PropertyType.cssSize,
      form: {
        defaultValue: '0px',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
    },

    // wordWrap: {
    //   type: PropertyType.String,
    //   form: {
    //     defaultValue: 'normal',
    //   },
    //   category: 'shortcut',
    //   objectPropertyToApply: 'sx',
    //   enum: ['normal', 'break-word', 'anywhere'],
    // },
    // textWrap: {
    //   type: PropertyType.String,
    //   form: {
    //     defaultValue: 'wrap',
    //   },
    //   category: 'shortcut',
    //   objectPropertyToApply: 'sx',
    //   enum: ['wrap', 'nowrap', 'balance'],
    // },
    lineBreak: {
      type: PropertyType.String,
      form: {
        defaultValue: 'auto',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: ['auto', 'loose', 'normal', 'strict', 'anywhere'],
    },
    wordBreak: {
      type: PropertyType.String,
      form: {
        defaultValue: 'normal',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: ['normal', 'break-all', 'keep-all'],
    },
    whiteSpace: {
      type: PropertyType.String,
      form: {
        defaultValue: 'normal',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: ['normal', 'break-spaces', 'nowrap', 'pre', 'pre-line', 'pre-wrap'],
    },
    whiteSpaceCollapse: {
      type: PropertyType.String,
      form: {
        defaultValue: 'collapse',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: [
        'collapse',
        'preserve',
        'preserve-breaks',
        'preserve-spaces',
        'break-spaces',
      ],
    },

    textDecoration: {
      type: PropertyType.cssTextDecoration,
      form: {
        defaultValue: 'none',
      },
      category: 'shortcut',
      // objectPropertyToApply: 'sx',
    },
    textShadow: {
      type: PropertyType.cssTextShadow,
      form: {},
      category: 'shortcut',
      objectPropertyToApply: 'sx',
    },
    textTransform: {
      type: PropertyType.String,
      form: {
        defaultValue: 'none',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: ['none', 'capitalize', 'uppercase', 'lowercase'],
    },
    writingMode: {
      type: PropertyType.String,
      form: {
        defaultValue: 'horizontal-tb',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: [
        'horizontal-tb',
        'vertical-rl',
        'vertical-lr',
        'sideways-rl',
        'sideways-lr',
      ],
    },
    textOrientation: {
      // affeects only when writingMode!= horizontal-tb
      type: PropertyType.String,
      form: {
        defaultValue: 'horizontal-tb',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: [
        'mixed',
        'upright',
        'sideways-right',
        'sideways',
        'use-glyph-orientation',
      ],
    },
    direction: {
      type: PropertyType.String,
      form: {
        defaultValue: 'ltr',
      },
      category: 'shortcut',
      objectPropertyToApply: 'sx',
      enum: ['ltr', 'rtl'],
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
