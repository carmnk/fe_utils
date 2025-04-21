import { mdiWindowMaximize } from '@mdi/js'
import { DialogPropsSchema } from './dialogPropsRawSchema'
import { DialogProps } from '@mui/material'
import { DialogWrapper } from './DialogWrapper'
import { CommonComponentPropertys } from '../../componentProperty'
import { ElementModel } from '../../componentDefType'

export const DialogComponentDef = {
  type: 'Dialog' as const,
  props: {
    open: false,
  },
  state: false,
  icon: mdiWindowMaximize,
  category: 'navigation',
  component: DialogWrapper,
  schema: DialogPropsSchema,
} satisfies ElementModel<DialogProps & CommonComponentPropertys>
