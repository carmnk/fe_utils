import { ExtendedTheme } from '../../theme/muiTheme'
import { Action } from './action'
import { ActionsParams } from './actionParam'
import { Attribute } from './attribute'
import { Component } from './component'
import { ComponentPropertyDefinition } from './componentPropertyDefinition'
import { CssSelector } from './css'
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

export type EditorStateType = {
  components: Component[]
  compositeComponentProps: ComponentPropertyDefinition[]
  actionParams: ActionsParams[]
  templateComponents: Template[]
  project: Project
  elements: Element[]
  alternativeViewports: {
    sm: Element[]
    md: Element[]
    lg: Element[]
    xl: Element[]
  }
  cssSelectors: CssSelector[]
  assets: {
    images: Image[]
  }
  defaultTheme: 'light' | 'dark'
  theme: ExtendedTheme
  themes: ExtendedTheme[]
  fonts: string[] // currently const
  attributes: Attribute[]
  properties: Property[]
  transformers: Transformer[]
  // ui: Ui
  server: {
    config: ServerConfig
    entityDataModel: EntityDataModel
  }
  externalApis: ExternalApi[]
  endpoints: Endpoint[]
  // events: ElementEvent[]
  actions: Action[]
  theme_typographys: ThemeTypography[]
}
