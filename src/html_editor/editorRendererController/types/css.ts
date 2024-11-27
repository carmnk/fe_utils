import { CSSProperties } from 'react'

export type CssWorkspace = {
  [classes: string]: CSSProperties
}
export type CssSelector = CSSProperties & {
  _id: string
  _userId: string
  // _userId: string
  _page?: string
  _type?: string
  css_selector_value: string
  css_selector_name?: string
  css_selector_key?: string
}

export type CssSelectorDb = {
  css_selector_id: string
  css_selector_name: string
  project_id: string
}
