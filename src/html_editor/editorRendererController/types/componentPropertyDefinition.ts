export type ComponentPropertyDefinition = {
  property_definition_id: string
  property_name: string
  property_type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  property_default_value: string | number | boolean | object | any[]
  template_id: string | null
  project_id: string
  component_id: string | null
}
