import { Header } from '../types/Header'
import { BodyParam } from '../types/bodyParam'
import { CssSelectorDb } from '../types/css'
import { ElementDb } from '../types/element'
import { EndpointDb } from '../types/endpoint'
import { ExternalApiDb } from '../types/externalApi'
import { ImageDb } from '../types/image'
import { Param } from '../types/param'
import { ProjectDb } from '../types/project'
import { SerializedThemeType } from '../types/serializedTheme'
import { Attribute } from '../types/attribute'
import { Component } from '../types/component'
import { EditorStateType } from '../types/editorState'
import { Property } from '../types/property'
import { Template } from '../types/template'
import { ThemeTypography } from '../types/themeTypographys'

export type EditorStateDbDataType = {
  components: Component[]
  project: ProjectDb
  elements: ElementDb[]
  attributes: Attribute[]
  properties: Property[]
  cssSelectors: CssSelectorDb[]
  images: ImageDb[]
  imageFiles?: {
    asset_id: string
    image: File
  }[]
  themes: SerializedThemeType[]
  action_params: EditorStateType['actionParams']
  transformers: EditorStateType['transformers']
  externalApis: ExternalApiDb[]
  composite_component_props: EditorStateType['compositeComponentProps']
  endpoints: EndpointDb[]
  headers: Header[]
  params: Param[]
  bodyParams: BodyParam[]
  actions: EditorStateType['actions']
  templates: Template[]
  data_changes?: any[]
  theme_typographys: ThemeTypography[]
}
