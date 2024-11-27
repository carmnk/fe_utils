import { mdiCheckboxMultipleBlank } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { ButtonGroupPropsSchema } from './buttonGroupPropsRawSchema'
import {
  ButtonGroup,
  ButtonGroupProps,
} from '../../../../components/buttons/ButtonGroup'
import { ComponentDefType } from '../../componentDefType'

export const buttonGroupEditorComponentDef = {
  type: 'ButtonGroup' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    items: [{ value: 'test', label: 'test' }],
  },
  state: 'test',
  formGen: ({ editorState }) =>
    propertyFormFactory(ButtonGroupPropsSchema, editorState),
  icon: mdiCheckboxMultipleBlank,
  category: 'navigation',
  component: ButtonGroup,
  schema: ButtonGroupPropsSchema,
} satisfies ComponentDefType<ButtonGroupProps>
