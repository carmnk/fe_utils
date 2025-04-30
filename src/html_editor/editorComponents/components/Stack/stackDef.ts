import { mdiViewColumnOutline } from '@mdi/js'
import { stackPropsSchema } from './stackPropsRawSchema'
import { StackWrapper, StackWrapperProps } from './stackWrapper'
import { ElementModel } from '../../componentDefType'
import { FC } from 'react'

export const stackEditorComponentDef = {
  type: 'Stack' as const,
  props: {},
  icon: mdiViewColumnOutline,
  category: 'layout',
  component: StackWrapper as FC<StackWrapperProps>,
  schema: stackPropsSchema,
} satisfies ElementModel<StackWrapperProps>
