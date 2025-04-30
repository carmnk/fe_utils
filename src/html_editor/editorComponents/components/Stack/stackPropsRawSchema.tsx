import {
  mdiAlignVerticalTop,
  mdiAlignVerticalBottom,
  mdiAlignVerticalCenter,
  mdiArrowExpandVertical,
  mdiFormatVerticalAlignCenter,
  mdiAlignHorizontalCenter,
  mdiAlignHorizontalLeft,
  mdiAlignHorizontalRight,
  mdiArrowExpandHorizontal,
  mdiArrowUDownLeft,
  mdiViewAgendaOutline,
  mdiViewColumnOutline,
} from '@mdi/js'
import { CSS_ALIGN, CSS_FLEX_DIRECTION, CSS_JUSTIFY } from '../../../defs'
import { CSS_RULE_NAMES_DICT_FULL } from '../../../defs/CssRulesNamesDictFull'
import { BASE_POINTER_EVENTS } from '../../commonEventSchemas/basePointerEvents'
import { CLIPBOARD_EVENTS } from '../../commonEventSchemas/clipboardEvents'
import { DRAG_EVENTS } from '../../commonEventSchemas/dragEvents'
import { MOUSE_EVENTS } from '../../commonEventSchemas/mouseEvents'
import { POINTER_EVENTS } from '../../commonEventSchemas/pointerEvents'
import { TOUCH_EVENTS } from '../../commonEventSchemas/touchEvents'
import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'
import { Typography } from '@mui/material'
import { LAYOUT_ELEMENT_PROPERTIES_SCHEMA } from '../../commonSchemas/layoutElementPropertySchema'

export const alignButtons = [
  { value: CSS_ALIGN.Start, icon: mdiAlignVerticalTop, tooltip: 'Start' },
  { value: CSS_ALIGN.End, icon: mdiAlignVerticalBottom, tooltip: 'End' },
  { value: CSS_ALIGN.Center, icon: mdiAlignVerticalCenter, tooltip: 'Center' },
  {
    value: CSS_ALIGN.Stretch,
    icon: mdiArrowExpandVertical,
    tooltip: 'Stretch',
  },
  {
    value: CSS_ALIGN.Baseline,
    icon: mdiFormatVerticalAlignCenter,
    tooltip: 'BaseLine',
  },
]

export const directionButtons = [
  {
    value: CSS_FLEX_DIRECTION.Row,
    icon: mdiViewColumnOutline,
    tooltip: 'Horizontal',
  },
  {
    value: CSS_FLEX_DIRECTION.Column,
    icon: mdiViewAgendaOutline,
    tooltip: 'Vertical',
  },
  null,
  { value: '-reverse', icon: mdiArrowUDownLeft, tooltip: 'Reverse' },
]
export const justifyButtons = [
  { value: CSS_JUSTIFY.Start, icon: mdiAlignHorizontalLeft, tooltip: 'Start' },
  {
    value: CSS_JUSTIFY.Center,
    icon: mdiAlignHorizontalCenter,
    tooltip: 'Center',
  },
  { value: CSS_JUSTIFY.End, icon: mdiAlignHorizontalRight, tooltip: 'End' },
  {
    value: CSS_JUSTIFY.Stretch,
    icon: mdiArrowExpandHorizontal,
    tooltip: 'Stretch',
  },
  {
    value: CSS_JUSTIFY.SpaceBetween,
    icon: <Typography fontSize="8px !important">|_|</Typography>,
    tooltip: 'Space Between',
  },
  {
    value: CSS_JUSTIFY.SpaceAround,
    icon: <Typography fontSize="8px !important">_||_</Typography>,
    tooltip: 'Space Around',
  },
  {
    value: CSS_JUSTIFY.SpaceEvenly,
    icon: <Typography fontSize="8px !important">_|_|_</Typography>,
    tooltip: 'Space Evenly',
  },
  // { value: CSS_JUSTIFY.SpaceAround, icon: mdiHelp, tooltip: "Space Around" },
  // { value: CSS_JUSTIFY.SpaceEvenly, icon: mdiHelp, tooltip: "Space Evenly" },
]

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const stackPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    children: {
      type: PropertyType.children,
      // required: true,
      category: 'layout',
    },

    ...LAYOUT_ELEMENT_PROPERTIES_SCHEMA,
    direction: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'stack',
      form: {
        defaultValue: 'row',
      },
      iconButtons: directionButtons.filter((val) => val) as NonNullable<
        (typeof directionButtons)[number]
      >[],
    },
    alignItems: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'stack',
      form: {
        defaultValue: 'flex-start',
      },
      iconButtons: alignButtons,
    },
    justifyContent: {
      type: PropertyType.buttonGroup,
      required: false,
      category: 'stack',
      form: {
        defaultValue: 'flex-start',
      },
      iconButtons: justifyButtons.filter((val) => val) as NonNullable<
        (typeof directionButtons)[number]
      >[],
    },
    gap: {
      type: PropertyType.cssGap,
      required: false,
      category: 'stack',
      form: {
        defaultValue: 'auto',
      },
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
    sx: {
      type: PropertyType.json,
      form: {
        defaultValue: {},
        label: 'allProps.sx (styles)',
      },
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
