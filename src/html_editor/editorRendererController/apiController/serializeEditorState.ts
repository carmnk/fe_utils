import { EditorStateType } from '../../types'
import { EditorStateDbDataType } from './editorDbStateType'
import { serializeAttributes } from './utils/serializeAttributes'
import { serializeProperties } from './utils/serializeProperties'
import { serializeElements } from './utils/serializeElements'
import { serializeImages } from './utils/serializeImages'
import { serializeProject } from './utils/serializeProject'
import { serializeExternalApis } from './utils/serializeExternalApis'
import { serializeThemes } from './utils/serializeThemes'

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
  const { images, /*imageFiles*/ } = serializeImages(
    payload.assets.images,
    project_id
  )
  const themes: EditorStateDbDataType['themes'] = serializeThemes(
    payload.themes,
    project_id
  )
  const { bodyParams, params, headers, endpoints, externalApis } =
    serializeExternalApis(payload.externalApis, project_id)

  return {
    project,
    elements,

    attributes,
    cssSelectors: [],
    images,
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
  }
}
