import { CSSProperties } from 'react'

export type CssWorkspace = {
  [classes: string]: CSSProperties
}
export type CssSelector = CSSProperties & {
  css_selector_id: string
  // _userId: string
  // _userId: string
  // element_page?: string
  // _type?: string
  css_selector_value: string
  css_selector_name?: string
  css_selector_key?: string
  project_id: string
}

export type CssSelectorDb = {
  css_selector_id: string
  css_selector_name: string
  project_id: string
}
