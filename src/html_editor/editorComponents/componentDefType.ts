import { FC } from 'react'
import { ExtendedObjectSchemaType } from './schemaTypes'

export type ElementCategory =
  | 'basic'
  | 'navigation'
  | 'surface'
  | 'shortcut'
  | 'layout'
  | 'shapeColor'
  | 'grid'
  | 'stack'
  | 'customize'
  | 'items'
  | 'data'
  | 'content'
  | 'events'
  | 'slots'

export type ElementModel<ComponentProps extends object = object> = {
  type: string
  component?: FC<ComponentProps>
  category: ElementCategory
  state?: string | boolean // currently just tested for truthyness
  schema: ExtendedObjectSchemaType
  props?: Record<string, unknown>
  icon: string
  renderType?: 'form' | 'navigation' | 'custom'
}
