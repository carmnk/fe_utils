import { Project, Ui } from '../../../types'
import { ProjectDb } from '../../../types/project'

export const serializeProject = (
  project: Project,
  ui: Ui,
  defaultTheme: string
): ProjectDb => {
  const uiIn = ui //as Omit<EditorStateType['ui'], 'detailsMenu'>
  const {
    page = null,
    cssSelector = null,
    image = null,
    state = null,
    element = null,
    font = null,
    serverSetting = null,
    entity = null,
    entityElement = null,
  } = uiIn.selected
  // save with project
  const uiOut = {
    selected_page: page ?? null,
    selected_server_setting: serverSetting ?? null,
    selected_css_selector: cssSelector ?? null,
    selected_image: image ?? null,
    selected_state: state ?? null,
    selected_element: element ?? null,
    selected_font: font ?? null,
    active_menu: uiIn?.navigationMenu?.activeMenu ?? null,
    active_tab: uiIn?.navigationMenu?.activeTab ?? null,
    active_backend_tab: uiIn?.navigationMenu?.activeBackendTab ?? null,
    pointer_mode: uiIn?.pointerMode ?? null,
    selected_entity: entity ?? null,
    selected_entity_element: entityElement ?? null,
  }
  const projectOut = {
    ...project,
    ...uiOut,
    default_theme: defaultTheme,
  }
  return projectOut
}
