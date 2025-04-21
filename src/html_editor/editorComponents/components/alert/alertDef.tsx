import { mdiAlertBoxOutline } from '@mdi/js'
import { AlertPropsSchema } from './alertPropsRawSchema'
import { ElementModel } from '../../componentDefType'
import { AlertWrapper, AlertWrapperProps } from './AlertWrapper'

export const AlertComponentDef = {
  type: 'Alert' as const,
  props: {
    open: false,
  },
  state: false,
  icon: mdiAlertBoxOutline,
  category: 'navigation',
  component: AlertWrapper,
  schema: AlertPropsSchema,
} satisfies ElementModel<AlertWrapperProps>
