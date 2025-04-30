import { mdiGridLarge } from '@mdi/js'
import { gridPropsSchema } from './gridPropsRawSchema'
import { GridWrapper, GridWrapperProps } from './gridWrapper'
import { ElementModel } from '../../componentDefType'
import { FC } from 'react'

export const gridEditorComponentDef = {
  type: 'Grid' as const,
  props: {},
  icon: mdiGridLarge,
  category: 'layout',
  component: GridWrapper as FC<GridWrapperProps>,
  schema: gridPropsSchema,
} satisfies ElementModel<GridWrapperProps>
