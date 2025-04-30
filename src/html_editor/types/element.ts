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
  
}

export type ElementDb = Element & {
  viewport: string | null
  // element_disable_delete?: boolean | null
}



// export type GenericElement<T extends string = string> = {
//   element_id: string // -> _
//   element_html_id: string | null // -> instead of attributes.id !!! (comp: -> _) // name!
//   parent_id: string | null // -> _ was children before !!!
//   content?: string // -> _
//   element_type: T //  -> _
//   // _disableDelete?: boolean
//   element_page: string | null
//   template_id: string | null
//   component_id: string | null
//   project_id: string
//   ref_component_id: string | null
// }
// export type Element2<T extends string = string> = GenericElement<T> &
//   (T extends BaseComponentType['type']
//     ? BaseComponentType & { type: T }
//     : never)