import { mdiRectangleOutline } from '@mdi/js'
import { boxPropsSchema } from './boxPropsRawSchema'
import { BoxWrapper, BoxWrapperProps } from './boxWrapper'
import { ElementModel } from '../../componentDefType'
import { FC } from 'react'

export const boxEditorComponentDef = {
  type: 'Box' as const,
  props: {
    display: 'block',
  },
  icon: mdiRectangleOutline,
  category: 'layout',
  component: BoxWrapper as FC<BoxWrapperProps>,
  schema: boxPropsSchema,
} satisfies ElementModel<BoxWrapperProps>
