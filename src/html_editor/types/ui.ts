import {
  LeftMenuGlobalTabs,
  LeftMenuTabs,
  LeftMenuBackendTabs,
} from '../defs/index'
import { UI_POINTER_MODE } from '../defs'

export type Ui = {
  isProjectInited: boolean
  isAutoSaveReady: boolean
  pointerMode: UI_POINTER_MODE.mixed | UI_POINTER_MODE.production // autosaved ???
  previewMode: boolean
  rulerMode: boolean
  viewportLimitsMode: boolean
  // currently not used
  editDragMode: null | 'leftMenu' | 'rightMenu'

  dragMode: 'reorder' | 'margin' | 'padding'
  selected: {
    // autosaved
    page: string | null
    element: string | null
    cssSelector: string | null
    image: string | null
    font: string | null
    state: string | null
    externalApi: string | null
    viewport: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    serverSetting: 'ssl' | 'cors'
    entity: string | null
    entityElement: 'fields' | 'lists' | 'values' | 'joinings'
    template: string | null
    component: string | null
  }

  navigationMenu: {
    width: number
    activeMenu: LeftMenuGlobalTabs
    activeTab: LeftMenuTabs | null // autosaved
    activeBackendTab: LeftMenuBackendTabs | null // autosaved
    expanded: {
      // autosaved
      elements: string[]
      components: string[]
      templates: string[]
      images: string[]
      state: string[]
      externalApis: string[]
    }
    // dont sync rest yet
    selectedTheme: string | null // change?
    isDragging: boolean
  }
  // dont sync yet
  detailsMenu: {
    width: number
    htmlElement: {
      cssRulesFilter: 'all' | 'classes' | 'styles'
      activeStylesTab: 'content' | 'events' | 'css_rules' | 'attributes'
      activeCssStyleTab: 'layout' | 'shape' | 'typography' | 'css_rules'
    }
  }
}
