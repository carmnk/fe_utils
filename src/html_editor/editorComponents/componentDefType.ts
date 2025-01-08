import { FC } from 'react'
import {
  EditorRendererControllerType,
  EditorStateType,
} from '../editorRendererController'
import { ExtendedObjectSchemaType } from './schemaTypes'
import { GenericFormProps } from '../../components'

export type ComponentDefType<ComponentProps extends object = object> = {
  type: string
  component?: FC<ComponentProps>

  category: string
  state?: string | boolean // currently just tested for truthyness
  schema: ExtendedObjectSchemaType
  props?: Record<string, unknown>
  icon: string
  // rootInjection?: DynamicFormInjectionsType
  formGen?: (
    params: {
      editorState: EditorStateType
      appController: EditorRendererControllerType['appController']
      currentViewportElements: EditorRendererControllerType['currentViewportElements']
      selectedPageElements: EditorRendererControllerType['selectedPageElements']
    },
    apiController?: unknown
  ) => Omit<GenericFormProps, 'formData' | 'onChangeFormData'>
  renderType?: 'form' | 'navigation' | 'custom'
}
