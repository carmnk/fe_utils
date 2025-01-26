export type Action = {
  action_id: string
  action_name: string
  endpoint_id?: string | null

  element_id: string | null
  prop_id: string
  project_id: string
  nav_element_id?: string | null
  internal_action_name?: string | null
}
