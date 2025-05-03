// import { BaseComponentType } from '../editorComponents'

export type Element = {
  element_id: string // -> _
  parent_id: string | null // -> _ was children before !!!
  element_type: string //  -> _
  element_html_id: string | null // -> instead of attributes.id !!! (comp: -> _) // name!
  content: string | null
  element_page: string | null
  template_id: string | null
  component_id: string | null
  ref_component_id: string | null
  project_id: string
  viewport: string | null
}

export type ElementDb = Element
