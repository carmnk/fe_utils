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
  github_updated_version_edited_datetime?: string | null
  use_github: boolean
  use_github_pages: boolean

  // from ui
}

export type ProjectDb = Project & {
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
  active_menu: string | null
}
