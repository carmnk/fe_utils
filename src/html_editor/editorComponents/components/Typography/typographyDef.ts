import { mdiFormatText } from '@mdi/js'
import { typographyPropsSchema } from './typographyPropsRawSchema'
import { TypographyWrapper, TypographyWrapperProps } from './TypographyWrapper'
import { ElementModel } from '../../componentDefType'
import { FC } from 'react'

export const typographyEditorComponentDef = {
  type: 'Typography' as const,
  props: {
    children: 'test',
    noWrap: false,
    align: 'inherit',
    variant: 'body1',
    sx: {},
  },
  icon: mdiFormatText,
  category: 'basic',
  component: TypographyWrapper as FC<TypographyWrapperProps>,
  schema: typographyPropsSchema,
} satisfies ElementModel<TypographyWrapperProps>
