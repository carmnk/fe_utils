import { Header } from '../../types/Header'
import { BodyParam } from '../../types/bodyParam'
import { ElementDb } from '../../types/element'
import { EndpointDb } from '../../types/endpoint'
import { ImageDb } from '../../types/image'
import { Param } from '../../types/param'
import { ProjectDb } from '../../types/project'
import { SerializedThemeType } from '../../types/serializedTheme'
import { EditorStateType } from '../../types/editorState'
import { DataChange } from '../../types/datachanges'
import { ExternalApiDb } from '../../types/externalApi'

export type EditorStateDbDataType = Pick<
  EditorStateType,
  | 'transformers'
  | 'actions'
  | 'components'
  | 'attributes'
  | 'properties'
  | 'cssSelectors'
  | 'action_params'
  | 'theme_typographys'
  | 'composite_component_props'
> & {
  project: ProjectDb
  elements: ElementDb[]
  images: ImageDb[]
  imageFiles?: {
    asset_id: string
    image: File
  }[]

  themes: SerializedThemeType[]

  externalApis: ExternalApiDb[]
  endpoints: EndpointDb[]
  headers: Header[]
  params: Param[]
  bodyParams: BodyParam[]

  templates: EditorStateType['elementTemplates']
  data_changes: DataChange[] // in FastEditorState

  // transformers: EditorStateType['transformers']
  // actions: EditorStateType['actions']
  // components: Component[]
  // attributes: Attribute[]
  // cssSelectors: CssSelectorDb[]
  //action_params: EditorStateType['action_params']
  // theme_typographys: ThemeTypography[]
  // composite_component_props: EditorStateType['composite_component_props']
}
