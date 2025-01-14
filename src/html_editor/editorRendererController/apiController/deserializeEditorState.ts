import { defaultEditorState } from '../defaultEditorState'
import { EditorStateType } from '../../types'
import { EditorStateDbDataType } from './editorDbStateType'
import { ComponentDefType } from '../../editorComponents'
import { deserializeAttributes } from './utils/deserializeAttributes'
import { deserializeProperties } from './utils/deserializeProperties'
import { deserializeElements } from './utils/deserializeElements'
import { deserializeServerExternalApis } from './utils/deserializeServerExternalApis'
import { deserializeImages } from './utils/deserializeImages'
import { deserializeProject } from './utils/deserializeProject'
import { deserializeTheme } from './utils/deserializeTheme'
import { deserializeThemeTypographys } from './utils/deserializeThemeTypographys'

export const deserializeEditorState = (
  data: EditorStateDbDataType,
  currentEditorState = defaultEditorState(),
  componentsIn: ComponentDefType[],
  disableThemeReload = false
): EditorStateType => {
  const { project, ui, defaultTheme } = deserializeProject(
    data?.project,
    currentEditorState.ui
  )
  const assets = {
    images: deserializeImages(
      data?.images,
      currentEditorState?.assets?.images,
      project.project_id
    ),
  }
  const { elements, alternativeViewports } = deserializeElements(
    data?.elements,
    componentsIn
  )

  const themes =
    disableThemeReload || !data.themes?.length
      ? currentEditorState.themes
      : data.themes
  // ony editorstate.theme will be non-serialized theme
  // : deserializeTheme(
  //     data.themes,
  //     currentEditorState?.themes,
  //     data.theme_typographys
  //   )
  const externalApis = deserializeServerExternalApis(
    data?.externalApis,
    data?.endpoints,
    data?.headers,
    data?.params,
    data?.bodyParams
  )

  const newTheme = themes?.find?.(
    (theme) => theme.mode === currentEditorState.theme.name
  )
  const theme_typographys =
    deserializeThemeTypographys(data?.theme_typographys) ?? []
  const theme = newTheme
    ? deserializeTheme(newTheme, theme_typographys)
    : currentEditorState?.theme

  return {
    ...currentEditorState,
    transformers: data?.transformers ?? [],
    properties: deserializeProperties(data?.properties, elements, componentsIn),
    attributes: deserializeAttributes(data?.attributes),
    defaultTheme: defaultTheme as 'light',
    alternativeViewports,
    project,
    elements,
    components: data.components ?? [],
    cssSelectors: [],
    ui,
    assets,
    themes,
    theme,
    externalApis,
    actions:
      data?.actions?.sort((a, b) => (a.action_id > b.action_id ? 1 : -1)) ?? [],
    elementTemplates: data?.templates ?? [],
    composite_component_props: data?.composite_component_props ?? [],
    action_params: data?.action_params ?? [],
    theme_typographys,
    fonts: data?.fonts ?? [],
  }
}
