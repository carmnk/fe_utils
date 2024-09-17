import { EditorStateType, ProjectType } from '../editorState'

// export type EditorStatePayloadType = Omit<
//   EditorStateType,
//   'fonts' | 'theme' | 'themes'
// > & {
//   project: ProjectType
// }

export type SerializedThemeType = {
  id: string
  project_id: string
  name: string
  // palette
  primary_main: string
  primary_light: string
  primary_dark: string
  primary_contrastText: string
  secondary_main: string
  secondary_light: string
  secondary_dark: string
  secondary_contrastText: string
  error_main: string
  error_light: string
  error_dark: string
  error_contrastText: string
  warning_main: string
  warning_light: string
  warning_dark: string
  warning_contrastText: string
  info_main: string
  info_light: string
  info_dark: string
  info_contrastText: string
  success_main: string
  success_light: string
  success_dark: string
  success_contrastText: string
  text_primary: string
  text_secondary: string
  text_disabled: string
  background_default: string
  background_paper: string
  action_active: string
  action_hover: string
  action_selected: string
  action_disabled: string
  action_disabled_background: string
  action_focus: string
  mode: string
}

export type EditorStateDbDataType = {
  components: {
    component_id: string
    component_name: string
    content: string | null
    project_id: string
    type: string
    template_id: string | null
  }[]
  project: ProjectType & {
    active_tab?: string
    active_backend_tab?: string
    pointer_mode?: string
    selected_css_selector?: string
    selected_element?: string
    selected_font?: string
    selected_image?: string
    selected_page?: string
    selected_server_setting?: 'ssl' | 'cors'
    selected_state?: string
    default_theme?: string
    selected_entity?: string
    selected_entity_element?: 'fields' | 'lists' | 'values' | 'joinings'
    github_updated_datetime?: string
    github_updated_version_edited_datetime?: string
  }
  elements: {
    element_id: string
    element_html_id: string | null
    project_id: string
    parent_id: string | null
    content: string | null
    element_type: string
    element_disable_delete: boolean | null
    element_page: string | null
    viewport: string | null
    template_id: string | null
    component_id: string | null
    ref_component_id: string | null
  }[]
  attributes: {
    element_id: string | null
    template_id: string | null
    attr_name: string
    attr_value: string
    project_id: string
    attr_id: string
    component_id: string | null
  }[]
  properties: {
    element_id: string | null
    template_id: string | null
    prop_name: string
    prop_value: string
    project_id: string
    prop_id: string
    component_id: string | null
  }[]
  cssSelectors: {
    css_selector_id: string
    css_selector_name: string
    project_id: string
  }[]
  images: {
    asset_id: string
    // image: typeof Image
    // src: string
    asset_filename: string
    project_id: string
    type: string
  }[]
  imageFiles?: {
    asset_id: string
    image: File
    // src: string
    // fileName: string
  }[]
  themes: SerializedThemeType[]
  action_params: EditorStateType['actionParams']
  transformers: EditorStateType['transformers']
  externalApis: ExternalApiDb[]
  composite_component_props: EditorStateType['compositeComponentProps']
  endpoints: EndpointDb[]
  headers: HeaderDb[]
  params: ParamDb[]
  bodyParams: BodyParamDb[]
  events: EditorStateType['events']
  actions: EditorStateType['actions']
  templates: {
    template_id: string
    project_id: string
    template_name: string
    content: string | null
    type: string
    is_default: boolean
  }[]
}

export type EndpointDb = {
  endpoint_id: string
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  response_type: 'json' | 'text' | 'blob' //XXX
  use_cookies: boolean //XXX
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string | null
  auth_basic_password: string | null
  auth_bearer_token: string | null
  api_id: string
  project_id: string
  // headers: { key: string; value: string }[] // -> subtable
  // params: { key: string; value: string }[] // -> subtable
  // body: { key: string; value: any }[] // -> subtable
}

export type HeaderDb = {
  header_id: string
  key: string
  value: string
  api_id: string | null
  endpoint_id: string | null
  project_id: string
}

export type ParamDb = {
  param_id: string
  key: string
  value: string
  endpoint_id: string
  project_id: string
}
export type BodyParamDb = {
  body_param_id: string
  key: string
  value: string
  endpoint_id: string
  project_id: string
}

export type ExternalApiDb = {
  external_api_id: string
  name: string
  base_url: string
  auth_type: 'basic' | 'bearer' | 'none'
  auth_basic_username: string
  auth_basic_password: string
  auth_bearer_token: string

  // headers: { key: string; value: string }[] // -> subtable
  use_cookies: boolean //XXX
  project_id: string
  // endpoints: Endpoint[]
}
