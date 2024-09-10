import { CSSProperties } from 'react'
import { baseHtmlDocument } from './editorStateBaseElements'
import {
  ExtendedTheme,
  muiDarkSiteTheme,
  muiLightSiteTheme,
} from '../theme/muiTheme'
import { cloneDeep } from 'lodash'
import { SYSTEM_FONTS_CSS_STRINGS } from '../defs/CssFontFamilies'
import { BaseComponentType } from '../editorComponents/baseComponents'
import { UI_POINTER_MODE } from '../defs/uiPointerMode'
import { v4 as uuid } from 'uuid'

export type Endpoint = {
  endpoint_id: string
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  responseType: 'json' | 'text' | 'blob'
  useCookies: boolean
  headers: { name: string; value: string; header_id?: string }[] // -> subtable
  params: { key: string; value: string; param_id?: string }[] // -> subtable
  body: { key: string; value: any; body_param_id?: string }[] // -> subtable
  auth:
    | { type: 'basic'; username: string; password: string }
    | { type: 'bearer'; token: string }
    | { type: 'none' }
}

export type ExternalApi = {
  external_api_id: string
  name: string
  baseUrl: string
  auth:
    | { type: 'basic'; username: string; password: string }
    | { type: 'bearer'; token: string }
    | { type: 'none' }
  headers: { name: string; value: string; header_id?: string }[] // -> subtable
  useCookies: boolean
  endpoints: Endpoint[]
}

export type ElementEvent = {
  event_id: string
  element_id: string
  event_name: string
  action_ids: string[]
  component_id: string | null
}
export type Action = {
  action_id: string
  action_name: string
  endpoint_id?: string | null
  // default_action_id?: string | null
  // navigation_action_id?: string | null
}

export type ComponentElementTypes = BaseComponentType['type']

export type ElementKeyType = keyof HTMLElementTagNameMap | ComponentElementTypes

export type GenericElementType<T extends ElementKeyType = ElementKeyType> = {
  _id: string // -> _
  _userID: string | null // -> instead of attributes.id !!! (comp: -> _) // name!
  _parentId: string | null // -> _ was children before !!!
  _content?: string // -> _
  _type: T //  -> _
  _disableDelete?: boolean
  _page: string | null
  template_id: string | null
  component_id: string | null
  project_id: string
  ref_component_id: string | null
}

export type ComponentElementType<T extends ElementKeyType = 'Button'> =
  GenericElementType<T> & {
    // props?: { [key: string]: any }
  }

export type ElementType<T extends ElementKeyType = ElementKeyType> =
  T extends keyof HTMLElementTagNameMap
    ? GenericElementType<T> & {
        // attributes?: HTMLProps<HTMLElementTagNameMap[T]> // subtable
      }
    : ComponentElementType<T>

export enum EditorStateLeftMenuTabs {
  PROJECT = 'project',
  PAGE = 'page',
  CSS = 'css',
  ASSETS = 'assets',
  Image = 'image',
  Localization = 'localization',
  Theme = 'theme',
  Font = 'font',
  Templates = 'templates',
  State = 'state',
  ExternalApi = 'externalApi',
  Components = 'components',
}

export enum EditorStateLeftMenuGlobalTabs {
  Frontend = 'frontend',
  Backend = 'backend',
  App = 'app',
}

export enum EditorStateLeftMenuBackendTabs {
  SERVER = 'server',
  AUTH = 'auth',
  DATABASE = 'database',
  Entities = 'entities',
}

export type CssWorkspaceType = {
  [classes: string]: CSSProperties
}
export type CssSelectorType = CSSProperties & {
  _id: string
  // _userId: string
  _page?: string
  _type?: string
  css_selector_value: string
  css_selector_name?: string
  css_selector_key?: string
}

export type ImageType = {
  _id: string
  image: typeof Image
  src: string
  fileName: string
  type: string
}

export type ProjectType = {
  project_name: string
  project_description?: string
  project_id: string
  // _user: string -> server
  created_datetime?: string
  edited_datetime?: string
  owner_user_id?: number
  project_type: 'static' | 'fullstack'

  html_pages_title: string
  html_pages_description: string
  html_pages_favicon: string | null
  github_updated_version_edited_datetime?: string | null

  // from ui
}

export type ServerConfigType = {
  serve_frontend: boolean
  ssl_private_key_path: string
  ssl_certificate_path: string
  disable_https: boolean
  disable_http: boolean
  disable_http_when_https_available: boolean
  https_port: number
  http_port: number
  allowed_origins: string[] // ['*'] -> all but unsupported if credentials = true / [] -> only same origin
  postgres_host: string
  postgres_port: number
  postgres_db: string
  postgres_user: string
  postgres_password: string
}

export type TemplateComponent = {
  template_id: string
  template_name: string
  content: string | null
  type: string
  is_default: boolean
  project_id: string
}

export type Component = {
  component_id: string
  component_name: string
  content: string | null
  type: string
  template_id: string | null
  project_id: string
}

export type CompositePropertyDefinition = {
  property_definition_id: string
  property_name: string
  property_type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  property_default_value: string | number | boolean | object | any[]
  template_id: string | null
  project_id: string
  component_id: string | null
}

export type ActionsParams = {
  action_param_id: string
  param_name: string
  param_value: string
  project_id: string
  element_id: string | null
  template_id: string | null
  component_id: string | null
}

export type EditorStateType = {
  components: Component[]
  compositeComponentProps: CompositePropertyDefinition[]
  actionParams: ActionsParams[]
  templateComponents: TemplateComponent[]
  project: ProjectType
  elements: ElementType[]
  alternativeViewports: {
    sm: ElementType[]
    md: ElementType[]
    lg: ElementType[]
    xl: ElementType[]
  }
  cssSelectors: CssSelectorType[]
  assets: {
    images: ImageType[]
  }
  defaultTheme: 'light' | 'dark'
  theme: ExtendedTheme
  themes: ExtendedTheme[]
  fonts: string[] // currently const
  // partly serialize for now

  attributes: {
    element_id: string | null
    template_id: string | null
    attr_name: string
    attr_value: any
    project_id: string
    attr_id: string
    component_id: string | null
  }[]
  properties: {
    element_id: string | null
    template_id: string | null
    prop_name: string
    prop_value: any
    project_id: string
    prop_id: string
    component_id: string | null
  }[]
  localUi: {
    hovering: {
      rightMenu: boolean
      leftMenu: boolean
    }
  }
  ui: {
    tableUis: {
      [key: string]: {
        onSetFilters: any
        filters: any[]
      }
    }
    initializeProjectModal: boolean
    isProjectInited: boolean
    isAutoSaveReady: boolean
    pointerMode: UI_POINTER_MODE.mixed | UI_POINTER_MODE.production
    previewMode: boolean
    editDragMode: null | 'leftMenu' | 'rightMenu'
    editorDragStartState: { mouseDownX: number; width: number } | null
    dragMode: 'reorder' | 'margin' | 'padding'
    copyPasteMode: 'copy' | 'cut' | null
    dragging: {
      elementIdFrom: string
      elementIdTo?: string
      currentPointerPos?: {
        x: number
        y: number
      }
      startPointerPos?: {
        x: number
        y: number
      }
      side?: 'top' | 'bottom' | 'left' | 'right'
    } | null
    selected: {
      page: string | null
      element: string | null
      hoveredElement: string | null
      hoveredElementSide: 'top' | 'bottom' | 'left' | 'right' | null
      cssSelector: string | null
      image: string | null
      font: string | null
      state: string | null
      externalApi: string | null
      viewport: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
      serverSetting: 'ssl' | 'cors'
      entity: string | null
      entityElement: 'fields' | 'lists' | 'values' | 'joinings'
      activeElementBoundingRect: {
        top: number
        left: number
        width: number
        height: number
        p: {
          paddingTop: number
          paddingRight: number
          paddingBottom: number
          paddingLeft: number
        }
        m: {
          marginTop: number
          marginRight: number
          marginBottom: number
          marginLeft: number
        }
      } | null
      template: string | null
      component: string | null
    }
    copied: {
      elements: string[] | null
    }
    cut: {
      elements: string[] | null
    }
    // dont sync yet
    detailsMenu: {
      width: number
      ruleName: string
      ruleValue: string
      addRuleName: string
      addRuleValue: string
      htmlElement: {
        editCssRuleName: string | null
        editCssRuleValue: string | null
        cssRulesFilter: 'all' | 'classes' | 'styles'
        activeStylesTab:
          | 'layout'
          | 'shape'
          | 'typography'
          | 'content'
          | 'events'
          | 'css_rules'
        classEditMode: boolean
      }
    }
    navigationMenu: {
      width: number
      activeMenu: EditorStateLeftMenuGlobalTabs
      activeTab: EditorStateLeftMenuTabs | null
      activeBackendTab: EditorStateLeftMenuBackendTabs | null
      expandedTreeItems: string[] // -> only elements!
      // dont sync rest yet
      elementAddComponentMode: string | null // remove?
      selectedTheme: string | null // change?
      isDragging: boolean
    }
  }
  server: {
    config: ServerConfigType
    entityDataModel: {
      _entities: []
      _entity_fields: []
      _entity_lists: []
      _entity_list_fields: []
      _entity_values: []
      _entity_joinings: []
    }
  }
  externalApis: ExternalApi[]
  endpoints: Endpoint[]
  events: ElementEvent[]
  actions: Action[]
}

export const defaultPageElements = () =>
  cloneDeep(baseHtmlDocument)?.map((el) => ({
    ...el,
    _id: uuid(),
    _parentId: null,
    _userID: null,
    _type: el._type as any,
    _page: 'index',
  })) ?? []

/** ATTENTION - DUPLICATE IN THE TEMPLATE PROJECT */
export const defaultEditorState = (): EditorStateType => {
  return {
    actionParams: [],
    compositeComponentProps: [],
    components: [],
    endpoints: [],
    defaultTheme: 'light',
    project: {
      project_id: uuid(),
      project_name: '',
      html_pages_title: 'Test Website',
      html_pages_description:
        'An app demonstrating the capabilities of the HTML Editor',
      project_type: 'static',
      html_pages_favicon: null,
    },
    templateComponents: [],
    attributes: [],
    properties: [],
    elements: defaultPageElements(),
    alternativeViewports: {
      sm: [],
      md: [],
      lg: [],
      xl: [],
    },
    // cssWorkspaces: {
    //   common: {},
    // },
    cssSelectors: [],
    assets: {
      images: [],
    },
    // themes2: [],
    theme: muiLightSiteTheme,
    themes: [muiLightSiteTheme, muiDarkSiteTheme] as any,
    localUi: {
      hovering: {
        rightMenu: false,
        leftMenu: false,
      },
    },
    ui: {
      isAutoSaveReady: false,
      initializeProjectModal: true,
      isProjectInited: false,
      tableUis: {},
      previewMode: false,
      pointerMode: UI_POINTER_MODE.mixed,
      dragMode: 'reorder',
      editDragMode: null,
      editorDragStartState: null,
      dragging: null,
      selected: {
        viewport: 'xs',
        page: 'index',
        element: null,
        hoveredElement: null,
        hoveredElementSide: null,
        cssSelector: null,
        image: null,
        font: null,
        state: null,
        serverSetting: 'ssl',
        entity: null,
        entityElement: 'fields',
        activeElementBoundingRect: null,
        externalApi: null,
        template: null,
        component: null,
      },
      copyPasteMode: null,
      copied: {
        elements: null,
      },
      cut: {
        elements: null,
      },
      // hovering: {
      //   rightMenu: false,
      //   leftMenu: false,
      // },

      detailsMenu: {
        width: 365,
        ruleName: '',
        ruleValue: '',
        addRuleName: '',
        addRuleValue: '',
        htmlElement: {
          editCssRuleName: null,
          editCssRuleValue: null,
          cssRulesFilter: 'all',
          activeStylesTab: 'layout',
          classEditMode: false,
        },
      },
      navigationMenu: {
        width: 320,
        activeMenu: EditorStateLeftMenuGlobalTabs.App,
        expandedTreeItems: [],
        activeTab: null,
        elementAddComponentMode: null,
        selectedTheme: null,
        activeBackendTab: EditorStateLeftMenuBackendTabs.SERVER,
        isDragging: false,
      },
    },
    fonts: [...SYSTEM_FONTS_CSS_STRINGS, "'Roboto'"],
    server: {
      config: {
        serve_frontend: true,
        ssl_private_key_path: '',
        ssl_certificate_path: '',
        disable_http: false,
        disable_https: true,
        disable_http_when_https_available: true,
        https_port: 443,
        http_port: 80,
        allowed_origins: [],
        postgres_host: 'localhost',
        postgres_db: 'entities',
        postgres_port: 5432,
        postgres_user: 'postgres',
        postgres_password: 'password',
      },
      entityDataModel: {
        _entities: [],
        _entity_fields: [],
        _entity_lists: [],
        _entity_list_fields: [],
        _entity_values: [],
        _entity_joinings: [],
      },
    },
    externalApis: [],
    events: [],
    actions: [],
  }
}
