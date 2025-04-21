import { mdiButtonCursor } from '@mdi/js'
import { ButtonPropsSchema } from './buttonPropsRawSchema'
import { ElementModel } from '../../componentDefType'
import { ButtonWrapper } from './ButtonWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

export const buttonEditorComponentDef = {
  type: 'Button' as const,

  component: ButtonWrapper,
  props: {
    label: 'Test-Label',
    disableElevation: true,
    sx: {},
    slotProps: {
      typography: {},
      startIcon: {},
      endIcon: {},
      tooltip: {},
    },
  },
  state: false,
  icon: mdiButtonCursor,
  category: 'basic',
  schema: ButtonPropsSchema,
} satisfies ElementModel<CommonComponentPropertys & { html_id: string }>
