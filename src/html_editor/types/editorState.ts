import { ExtendedTheme } from '../theme/muiTheme'
import { Action } from './action'
import { ActionsParams } from './actionParam'
import { Attribute } from './attribute'
import { Component } from './component'
import { ComponentPropertyDefinition } from './componentPropertyDefinition'
import { CssSelectorDb } from './css'
import { Endpoint } from './endpoint'
import { EntityDataModel } from './entityDataModel'
import { ExternalApi } from './externalApi'
import { Image } from './image'
import { Project } from './project'
import { Property } from './property'
import { ServerConfig } from './serverConfig'
import { Template } from './template'
import { Ui } from './ui'
import { Element } from './element'
import { Transformer } from './transformer'
import { ThemeTypography } from './themeTypographys'
import { SerializedThemeType } from './serializedTheme'
import { Font } from './Font'

export type EditorStateType = {
  actions: Action[]
  action_params: ActionsParams[]
  alternativeViewports: {
    sm: Element[]
    md: Element[]
    lg: Element[]
    xl: Element[]
  }
  assets: {
    images: Image[]
  }
  attributes: Attribute[]
  components: Component[]
  composite_component_props: ComponentPropertyDefinition[]
  defaultTheme: 'light' | 'dark'
  elements: Element[]
  elementTemplates: Template[]
  externalApis: ExternalApi[]
  endpoints: Endpoint[]
  fonts: Font[] // currently const
  project: Project
  properties: Property[]
  server: {
    config: ServerConfig
    entityDataModel: EntityDataModel
  }
  themes: SerializedThemeType[]
  transformers: Transformer[]
  theme_typographys: ThemeTypography[]

  // not autosaved
  theme: ExtendedTheme
  cssSelectors: CssSelectorDb[]
  ui: Ui // partly autosaved
}
