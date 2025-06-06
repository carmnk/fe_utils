import { mdiInformation } from '@mdi/js'
import { chipPropsSchema } from './chipPropsRawSchema'
import { ChipWrapper, ChipWrapperProps } from './ChipWrapper'
import { ElementModel } from '../../componentDefType'

export const chipEditorComponentDef = {
  type: 'Chip' as const,
  props: {
    label: 'test',
  },
  icon: mdiInformation,
  category: 'basic',
  component: ChipWrapper,
  schema: chipPropsSchema,
} satisfies ElementModel<ChipWrapperProps>
