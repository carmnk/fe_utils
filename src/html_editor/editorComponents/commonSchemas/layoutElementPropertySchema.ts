import {
  mdiArrowDown,
  mdiMoveResize,
  mdiAxis,
  mdiAnchor,
  mdiStickerCircleOutline,
} from '@mdi/js'
import { HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS } from '../../defs'
import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'
import { CSS_CURSOR_OPTIONS } from '../../defs/CssCursorOptoins'

export const positionButtons = [
  {
    value: 'static',
    icon: mdiArrowDown,
    tooltip: 'Static',
  },
  {
    value: 'relative',
    icon: mdiMoveResize,
    tooltip: 'Relative',
  },
  {
    value: 'absolute',
    icon: mdiAxis,
    tooltip: 'Absolute',
  },
  { value: 'fixed', icon: mdiAnchor, tooltip: 'Fixed' },
  {
    value: 'sticky',
    icon: mdiStickerCircleOutline,
    tooltip: 'Sticky',
  },
]

export const LAYOUT_ELEMENT_PROPERTIES_SCHEMA: ExtendedObjectSchemaType['properties'] =
  {
    component: {
      type: PropertyType.String,
      form: {
        defaultValue: 'div',
      },
      enum: HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      groupBy: (item: unknown) =>
        item && typeof item === 'object' && 'category' in item
          ? (item?.category as string)
          : undefined,
      category: 'layout',
    },
    position: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'static',
      },
      iconButtons: positionButtons,
    },
    width: {
      type: PropertyType.cssSize,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },
    minWidth: {
      type: PropertyType.cssSize,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },
    maxWidth: {
      type: PropertyType.cssSize,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },
    height: {
      type: PropertyType.cssSize,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },
    minHeight: {
      type: PropertyType.cssSize,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },
    maxHeight: {
      type: PropertyType.cssSize,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },
    overflow: {
      type: PropertyType.String,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'visible',
      },
      enum: ['auto', 'visible', 'hidden', 'clip', 'scroll'],
    },
    zIndex: {
      type: PropertyType.Int,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },

    spacing: {
      type: PropertyType.cssSpacing,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'auto',
      },
    },
    boxSizing: {
      type: PropertyType.String,
      required: false,
      category: 'layout',
      form: {
        defaultValue: 'border-box',
      },
      enum: ['inherit', 'border-box', 'content-box'],
    },
    scrollbarWidth: {
      type: PropertyType.String,
      required: false,
      category: 'layout',
      objectPropertyToApply: 'sx',
      form: {
        defaultValue: 'auto',
      },
      enum: ['auto', 'thin', 'none'],
    },
    scrollbarGutter: {
      type: PropertyType.String,
      required: false,
      category: 'layout',
      objectPropertyToApply: 'sx',
      form: {
        defaultValue: 'auto',
      },
      enum: ['auto', 'stable'],
    },
    bgcolor: {
      type: PropertyType.color,
      required: false,
      category: 'shapeColor',
      form: {
        defaultValue: 'transparent',
      },
    },
    color: {
      type: PropertyType.color,
      required: false,
      category: 'shapeColor',
      form: {
        defaultValue: 'inherit',
      },
    },
    border: {
      type: PropertyType.cssBorder,
      required: false,
      category: 'shapeColor',
      form: {
        defaultValue: 'inherit',
      },
    },
    borderRadius: {
      type: PropertyType.cssBorderRadius,
      required: false,
      category: 'shapeColor',
      form: {
        defaultValue: 'inherit',
      },
    },
    background: {
      type: PropertyType.cssBackground,
      required: false,
      category: 'shapeColor',
      form: {
        defaultValue: 'inherit',
      },
    },
    opacity: {
      type: PropertyType.Number,
      objectPropertyToApply: 'sx',
      required: false,
      category: 'shapeColor',
      form: {
        defaultValue: 1,
      },
    },
    cursor: {
      type: PropertyType.String,
      objectPropertyToApply: 'sx',
      required: false,
      category: 'shapeColor',
      form: {
        defaultValue: 'default',
      },
      enum: CSS_CURSOR_OPTIONS,
    },
  }
