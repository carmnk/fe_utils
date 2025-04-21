import { buttonEditorComponentDef } from './components/Button/buttonDef'
import { buttonGroupEditorComponentDef } from './components/ButtonGroup/buttonGroupDef'
import { listNavEditorComponentDef } from './components/ListNav/listNavDef'
import { TabsComponentDef } from './components/Tabs/tabsDef'
import { BottomNavComponentDef } from './components/BottomNavigation/bottomNavDefDef'
import { appBarDef } from './components/AppBar/appBarDef'
import { chipEditorComponentDef } from './components/Chip/chipDef'
import { typographyEditorComponentDef } from './components/Typography/typographyDef'
import { tableEditorComponentDef } from './components/Table/TableDef'
import { formEditorComponentDef } from './components/Form/formDef'
import { ElementModel } from './componentDefType'
import { navigationContainerDef } from './components/NavigationContainer/navigationContainerDef'
import { paperDef } from './components/Paper/paperDef'
import { IconComponentDef } from './components/icon/iconDef'
import { AlertComponentDef } from './components/alert/alertDef'
import { DialogComponentDef } from './components/dialog/dialogDef'
import { treeViewDef } from './components/TreeView/TreeViewDef'
import { linkEditorComponentDef } from './components/Link/LinkDef'
import { boxEditorComponentDef } from './components/Box/boxDef'
import { stackEditorComponentDef } from './components/Stack/stackDef'
import { gridEditorComponentDef } from './components/Grid/gridDef'
import { imageEditorComponentDef } from './components/Image/imageDef'

export const BASE_ELEMENT_MODELS = [
  boxEditorComponentDef,
  stackEditorComponentDef,
  gridEditorComponentDef,

  
  typographyEditorComponentDef,
  linkEditorComponentDef,
  chipEditorComponentDef,
  // surface components
  appBarDef,
  paperDef,
  IconComponentDef,
  imageEditorComponentDef,

  // Navigation components
  buttonEditorComponentDef,
  TabsComponentDef,
  BottomNavComponentDef,
  listNavEditorComponentDef,
  buttonGroupEditorComponentDef,
  AlertComponentDef,
  DialogComponentDef,

  tableEditorComponentDef,
  formEditorComponentDef,
  treeViewDef as any,

  // Navigation container, currently treated specially/hardcoded (use for generic?)
  navigationContainerDef,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] satisfies ElementModel<any>[]

export type BaseComponentsType = typeof BASE_ELEMENT_MODELS
export type BaseComponentType = BaseComponentsType[number]
