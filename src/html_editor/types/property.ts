export type Property = {
  element_id: string | null
  template_id: string | null
  prop_name: string
  prop_value: unknown
  project_id: string
  prop_id: string
  component_id: string | null
  action_ids?: string[]
  viewport: string | null
}
