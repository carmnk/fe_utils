export type DataChange = {
  data_change_id: number
  attribute_name?: string | null
  path: string[]
  user_id: number
  entity_name: string | null
  entity_instance_id: string | null
  old_value: string | null
  new_value: string | null
  change_datetime: string | null
  sql_query: string | null
  change_type: string | null
  entity_id: string | null
  entity_value_key: string | null
  user_change_id: string | null
}
