import { mdiCheckboxMultipleBlank } from '@mdi/js'
import { ButtonGroupPropsSchema } from './buttonGroupPropsRawSchema'
import { ButtonGroupProps } from '../../../../components/buttons/ButtonGroup'
import { ElementModel } from '../../componentDefType'
import { ButtonGroupWrapper } from './ButtonGroupWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

export const buttonGroupEditorComponentDef = {
  type: 'ButtonGroup' as const,
  props: {
    items: [
      {
        value: 'item1',
        label: 'Item 1',
        isInitialValue: true,
      },
      { value: 'item2', label: 'Item 2' },
    ],
  },
  state: 'test',
  icon: mdiCheckboxMultipleBlank,
  category: 'navigation',
  component: ButtonGroupWrapper,
  schema: ButtonGroupPropsSchema,
  renderType: 'navigation',
} satisfies ElementModel<ButtonGroupProps & CommonComponentPropertys>
