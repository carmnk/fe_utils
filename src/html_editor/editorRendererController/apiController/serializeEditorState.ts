import { EditorStateType, Image } from '../../types'
import { EditorStateDbDataType } from './editorDbStateType'
import { serializeAttributes } from './serialize/serializeAttributes'
import { serializeProperties } from './serialize/serializeProperties'
import { serializeElements } from './serialize/serializeElements'
import { serializeImages } from './serialize/serializeImages'
import { serializeProject } from './serialize/serializeProject'
import { serializeExternalApis } from './serialize/serializeExternalApis'
import { serializeFonts } from './serialize/serializeFonts'

export const serializeEditorState = (
  payload: EditorStateType
): Omit<EditorStateDbDataType, 'data_changes'> | null => {
  const projectIn = payload?.project ?? {}
  const project_id = projectIn.project_id
  if (!project_id) {
    alert('project_id is missing')
    console.warn(
      'project_id is missing:',
      projectIn,
      `(projectIn)`,
      payload,
      `(payload)`
    )
    return null
  }
  const uiIn = payload.ui //as Omit<EditorStateType['ui'], 'detailsMenu'>

  const project = serializeProject(projectIn, uiIn, payload.defaultTheme)
  const elements = serializeElements(
    payload.elements,
    payload.alternativeViewports,
    project_id
  )
  const properties = serializeProperties(payload.properties)
  const attributes = serializeAttributes(payload?.attributes)
  // seperate handling! -> must be multipart form data!!!!
  const { images /*imageFiles*/ } = serializeImages(
    payload.assets.images,
    project_id
  )
  const themes: EditorStateDbDataType['themes'] = payload.themes

  const { bodyParams, params, headers, endpoints, externalApis } =
    serializeExternalApis(payload.externalApis, project_id)

  return {
    project,
    elements,

    attributes,
    cssSelectors: [],
    images: images as Image[],
    // imageFiles,
    themes,
    externalApis,
    endpoints,
    headers,
    params,
    bodyParams,
    actions:
      payload.actions?.sort((a, b) => (a.action_id > b.action_id ? 1 : -1)) ??
      [],
    properties,
    templates: payload.elementTemplates,
    composite_component_props: payload.composite_component_props,
    action_params: payload.action_params,
    transformers: payload.transformers,
    components: payload.components,
    theme_typographys: payload.theme_typographys,
    fonts: serializeFonts(payload.fonts, project_id),
  }
}
