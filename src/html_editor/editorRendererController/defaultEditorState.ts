import { muiLightSiteTheme } from '../theme/muiTheme'
import cloneDeep from 'lodash/cloneDeep'
import { UI_POINTER_MODE } from '../defs/uiPointerMode'
import { v4 as uuid } from 'uuid'
import { LeftMenuGlobalTabs } from '../defs/LeftMenuGlobalTabs'
import { LeftMenuBackendTabs } from '../defs/LeftMenuBackendTabs'
import { EditorStateType } from '../types/editorState'
import { Attribute, Element, Property } from '../types'
import { DEFAULT_THEMES_SERIALIZED } from '../theme/serializedMuiTheme'

const baseHtmlDocument: Element[] = [
  {
    element_id: uuid(),
    element_type: 'div',
    element_page: 'index',
    parent_id: null,
    element_html_id: null,
    template_id: null,
    component_id: null,
  } as Element,
]

export const makeNewProperty = (params: {
  prop_id?: string
  element_id: string
  prop_name: string
  prop_value: string
  project_id: string
  template_id?: string
  component_id?: string
  action_ids?: string[]
  viewport?: string
}): Property => {
  const {
    prop_id,
    element_id,
    project_id,
    prop_name,
    prop_value,
    template_id,
    component_id,
    action_ids,
    viewport,
  } = params
  return {
    element_id,
    prop_name,
    prop_value,
    project_id,
    prop_id: prop_id ?? uuid(),
    template_id: template_id ?? null,
    component_id: component_id ?? null,
    action_ids: action_ids ?? [],
    viewport: viewport ?? null,
  }
}

export const makeNewAttribute = (params: {
  attr_id?: string
  element_id?: string
  template_id?: string
  component_id?: string
  project_id: string
  attr_name: string
  attr_value: any
  viewport?: string
}): Attribute => {
  const {
    attr_id,
    element_id,
    template_id,
    component_id,
    project_id,
    attr_name,
    attr_value,
    viewport,
  } = params
  return {
    attr_id: attr_id ?? uuid(),
    element_id: element_id ?? null,
    template_id: template_id ?? null,
    component_id: component_id ?? null,
    project_id,
    attr_name,
    attr_value,
    viewport: viewport ?? null,
  }
}

export const defaultElements = (project_id: string) =>
  cloneDeep(baseHtmlDocument)?.map((el) => ({
    ...el,
    element_id: uuid(),
    project_id,
  })) ?? []
export const defaultProperties = (rootElementId: string, project_id: string) =>
  makeNewProperty({
    element_id: rootElementId,
    project_id,
    prop_name: 'height',
    prop_value: '100%',
  })

/** ATTENTION - DUPLICATE IN THE TEMPLATE PROJECT */
export const defaultEditorState = (
  existingProjectId?: string
): EditorStateType => {
  const project_id = existingProjectId ?? uuid()
  const rootElements = defaultElements(project_id)
  const rootElementId = rootElements?.[0]?.element_id

  const newAttribute = makeNewAttribute({
    element_id: rootElementId,
    project_id,
    attr_name: 'style',
    attr_value: { height: '100%' },
  })
  return {
    action_params: [],
    composite_component_props: [],
    components: [],
    endpoints: [],
    defaultTheme: 'light',
    project: {
      project_id,
      project_name: '',
      html_pages_title: 'Test Website',
      html_pages_description:
        'An app demonstrating the capabilities of the HTML Editor',
      project_type: 'static',
      html_pages_favicon: null,
      use_github: false,
      use_github_pages: false,
    },
    elementTemplates: [],
    attributes: [newAttribute],
    properties: [],
    transformers: [],
    elements: rootElements,
    alternativeViewports: {
      sm: [],
      md: [],
      lg: [],
      xl: [],
    },
    cssSelectors: [],
    assets: {
      images: [],
    },
    theme: muiLightSiteTheme,
    themes: DEFAULT_THEMES_SERIALIZED(project_id),
    theme_typographys: [],
    ui: {
      isAutoSaveReady: false,
      isProjectInited: false,
      previewMode: false,
      pointerMode: UI_POINTER_MODE.mixed,
      dragMode: 'reorder',
      editDragMode: null,
      rulerMode: false,
      viewportLimitsMode: false,
      selected: {
        viewport: 'xs',
        page: 'index',
        element: null,
        cssSelector: null,
        image: null,
        font: null,
        state: null,
        serverSetting: 'ssl',
        entity: null,
        entityElement: 'fields',
        externalApi: null,
        template: null,
        component: null,
      },
      detailsMenu: {
        width: 365,
        htmlElement: {
          cssRulesFilter: 'all',
          activeStylesTab: 'attributes',
          activeCssStyleTab: 'css_rules',
        },
      },
      navigationMenu: {
        width: 320,
        activeMenu: LeftMenuGlobalTabs.App,
        activeTab: null,
        selectedTheme: null,
        activeBackendTab: LeftMenuBackendTabs.SERVER,
        isDragging: false,
        expanded: {
          elements: [],
          components: [],
          templates: [],
          images: [],
          state: [],
          externalApis: [],
        },
      },
    },
    fonts: [],
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
    actions: [],
    viewport_references: [],
  }
}
