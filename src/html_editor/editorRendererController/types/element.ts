import { BaseComponentType } from '../../editorComponents'

export type GenericElement<T extends string = string> = {
  _id: string // -> _
  _userID: string | null // -> instead of attributes.id !!! (comp: -> _) // name!
  _parentId: string | null // -> _ was children before !!!
  _content?: string // -> _
  _type: T //  -> _
  // _disableDelete?: boolean
  _page: string | null
  template_id: string | null
  component_id: string | null
  project_id: string
  ref_component_id: string | null
}
export type Element2<T extends string = string> = GenericElement<T> &
  (T extends BaseComponentType['type']
    ? BaseComponentType & { type: T }
    : never)

export type Element = {
  _id: string // -> _
  _userID: string | null // -> instead of attributes.id !!! (comp: -> _) // name!
  _parentId: string | null // -> _ was children before !!!
  _content?: string // -> _
  _type: string //  -> _
  // _disableDelete?: boolean
  _page: string | null
  template_id: string | null
  component_id: string | null
  project_id: string
  ref_component_id: string | null
}

export type ElementDb = {
  element_id: string
  element_html_id: string | null
  project_id: string
  parent_id: string | null
  content: string | null
  element_type: string
  // element_disable_delete?: boolean | null
  element_page: string | null
  viewport: string | null
  template_id: string | null
  component_id: string | null
  ref_component_id: string | null
}
