import { mdiLink } from '@mdi/js'
import { linkPropsSchema } from './LinkPropsRawSchema'
import { LinkWrapper, LinkWrapperProps } from './LinkWrapper'
import { ElementModel } from '../../componentDefType'
import { FC } from 'react'

export const linkEditorComponentDef = {
  type: 'Link' as const,
  props: {
    children: 'test',
    noWrap: false,
    align: 'inherit',
    sx: {},
  },
  icon: mdiLink,
  category: 'basic',
  component: LinkWrapper as FC<LinkWrapperProps>,
  schema: linkPropsSchema,
} satisfies ElementModel<LinkWrapperProps>
