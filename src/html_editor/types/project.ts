export type Project = {
  project_name: string
  project_description?: string
  project_id: string
  // _user: string -> server
  created_datetime?: string
  edited_datetime?: string
  owner_user_id?: number
  project_type: 'static' | 'fullstack'

  html_pages_title: string
  html_pages_description: string
  html_pages_favicon: string | null
  github_updated_datetime?: string | null
  github_updated_version_edited_datetime?: string | null
  use_github: boolean
  use_github_pages: boolean
  use_github_dev_branch: boolean
  // from ui
}

export type ProjectDb = Project & {
  active_tab?: string | null
  active_backend_tab?: string | null
  pointer_mode?: string
  selected_css_selector?: string | null
  selected_element?: string | null
  selected_font?: string | null
  selected_image?: string | null
  selected_page?: string | null
  selected_server_setting?: 'ssl' | 'cors' | null
  selected_state?: string | null
  default_theme?: string
  selected_entity?: string | null
  selected_entity_element?: 'fields' | 'lists' | 'values' | 'joinings' | null
  active_menu: string | null
  expanded_elements?: string | null
  expanded_components?: string | null
  expanded_templates?: string | null
  expanded_external_apis?: string | null
  expanded_state?: string | null
}
