import { mdiImageOutline } from '@mdi/js'
import { imagePropsSchema } from './imagePropsRawSchema'
import { ImageWrapper, ImageWrapperProps } from './ImageWrapper'
import { ElementModel } from '../../componentDefType'
import { FC } from 'react'

export const imageEditorComponentDef = {
  type: 'Image' as const,
  props: {
  },
  icon: mdiImageOutline,
  category: 'basic',
  component: ImageWrapper as FC<ImageWrapperProps>,
  schema: imagePropsSchema,
} satisfies ElementModel<ImageWrapperProps>
