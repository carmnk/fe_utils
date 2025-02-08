import {
  LeftMenuBackendTabs,
  LeftMenuGlobalTabs,
  LeftMenuTabs,
  UI_POINTER_MODE,
} from '../../../defs'
import { EditorStateType, Ui } from '../../../types'
import { ProjectDb } from '../../../types/project'

export const deserializeProject = (
  projectIn: ProjectDb,
  editorStateUi: Ui
): Pick<EditorStateType, 'project' | 'ui' | 'defaultTheme'> => {
  const {
    selected_css_selector,
    selected_element,
    selected_font,
    selected_image,
    selected_page,
    selected_server_setting,
    selected_state,
    selected_entity,
    selected_entity_element,
    active_tab,
    active_backend_tab,
    pointer_mode,
    active_menu,
    default_theme: defaultTheme,
    expanded_elements,
    expanded_components,
    expanded_templates,
    expanded_external_apis,
    expanded_state,
    ...project
  } = projectIn ?? {}

  const ui: Ui = {
    ...(editorStateUi ?? {}),
    selected: {
      ...(editorStateUi?.selected ?? {}),
      cssSelector: selected_css_selector ?? null,
      element: selected_element ?? null,
      font: selected_font ?? null,
      image: selected_image ?? null,
      page: selected_page ?? null,
      serverSetting: selected_server_setting ?? 'ssl',
      state: selected_state ?? null,
      entity: selected_entity ?? null,
      entityElement: selected_entity_element ?? 'fields',
    },
    navigationMenu: {
      ...(editorStateUi?.navigationMenu ?? {}),
      activeTab: (active_tab ?? null) as LeftMenuTabs,
      activeBackendTab: (active_backend_tab ?? null) as LeftMenuBackendTabs,
      activeMenu: (active_menu ??
        editorStateUi?.navigationMenu?.activeMenu) as LeftMenuGlobalTabs,
      expanded: {
        ...(editorStateUi?.navigationMenu?.expanded ?? {}),
        elements: expanded_elements ? JSON.parse(expanded_elements) : [],
        components: expanded_components ? JSON.parse(expanded_components) : [],
        templates: expanded_templates ? JSON.parse(expanded_templates) : [],
        externalApis: expanded_external_apis
          ? JSON.parse(expanded_external_apis)
          : [],
        state: expanded_state ? JSON.parse(expanded_state) : [],
      },
    },
    pointerMode: (pointer_mode as UI_POINTER_MODE) ?? UI_POINTER_MODE.mixed,
  }
  return {
    project,
    ui,
    defaultTheme: defaultTheme as 'light',
  }
}
