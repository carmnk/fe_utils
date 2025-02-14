import { FC } from 'react'
import {
  AppController,
  EditorRendererControllerType,
  EditorStateType,
  Element,
} from '../editorRendererController'
import { NavigateFunction } from 'react-router-dom'
import { ExtendedTheme } from '../theme/muiTheme'

export type CommonComponentPropertys = {
  appController: AppController
  id: string
  isProduction: boolean
  editorStateUi: EditorStateType['ui']
}

export type NavContainerComponentPropertys = CommonComponentPropertys & {
  editorState: EditorStateType
  currentViewportElements: EditorRendererControllerType['currentViewportElements']
  ELEMENT_MODELS: EditorRendererControllerType['ELEMENT_MODELS']
  OverlayComponent?: FC<{ element: Element }>
  isPointerProduction: boolean
  icons: Record<string, string>
  navigate: NavigateFunction
  rootCompositeElementId?: string
  onSelectElement: (element: Element, isHovering: boolean) => void
  disableOverlay?: boolean
  baseComponentId?: string
  uiActions?: unknown
  items: { value: string; childId: string }[]
  navigationElementId: string
  parentId: string
  theme: ExtendedTheme
}
