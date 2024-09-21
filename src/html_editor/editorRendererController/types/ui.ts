import {
  LeftMenuGlobalTabs,
  LeftMenuTabs,
  LeftMenuBackendTabs,
} from './../../defs/index'
import { UI_POINTER_MODE } from '../../defs'

export type Ui = {
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
    //
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
    activeMenu: LeftMenuGlobalTabs
    activeTab: LeftMenuTabs | null
    activeBackendTab: LeftMenuBackendTabs | null
    expandedTreeItems: string[] // -> only elements!
    // dont sync rest yet
    elementAddComponentMode: string | null // remove?
    selectedTheme: string | null // change?
    isDragging: boolean
  }
}
