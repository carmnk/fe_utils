import { muiDarkSiteTheme, muiLightSiteTheme } from '../theme/muiTheme'
import { cloneDeep } from 'lodash'
import { SYSTEM_FONTS_CSS_STRINGS } from '../defs/CssFontFamilies'
import { UI_POINTER_MODE } from '../defs/uiPointerMode'
import { v4 as uuid } from 'uuid'
import { LeftMenuGlobalTabs } from '../defs/LeftMenuGlobalTabs'
import { LeftMenuBackendTabs } from '../defs/LeftMenuBackendTabs'
import { EditorStateType } from './types/editorState'
import { Element } from './types'

export const baseHtmlDocument: Element[] = [
  {
    _id: uuid(),
    _type: 'div',
    // _disableDelete: true,
    _page: 'index',
    _parentId: null,
    _userID: '',
    template_id: null,
    component_id: null,
  } as Element,
]

export const defaultPageElements = () =>
  cloneDeep(baseHtmlDocument)?.map((el) => ({
    ...el,
    _id: uuid(),
    _parentId: null,
    _userID: null,
    _type: el._type,
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
      use_github: false,
      use_github_pages: false,
    },
    templateComponents: [],
    attributes: [],
    properties: [],
    transformers: [],
    elements: defaultPageElements(),
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
    themes: [muiLightSiteTheme, muiDarkSiteTheme],
    theme_typographys: [],
    ui: {
      isAutoSaveReady: false,
      initializeProjectModal: true,
      isProjectInited: false,
      tableUis: {},
      previewMode: false,
      pointerMode: UI_POINTER_MODE.mixed,
      dragMode: 'reorder',
      editDragMode: null,
      rulerMode: false,
      viewportLimitsMode: false,
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
          activeStylesTab: 'attributes',
          activeCssStyleTab: 'css_rules',
          classEditMode: false,
        },
      },
      navigationMenu: {
        width: 320,
        activeMenu: LeftMenuGlobalTabs.App,
        expandedTreeItems: [],
        activeTab: null,
        elementAddComponentMode: null,
        selectedTheme: null,
        activeBackendTab: LeftMenuBackendTabs.SERVER,
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
    actions: [],
  }
}
