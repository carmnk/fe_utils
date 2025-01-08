import { FC } from 'react'
import {
  AppController,
  EditorRendererControllerType,
  EditorStateType,
  Element,
} from '../editorRendererController'
import { NavigateFunction } from 'react-router-dom'

export type CommonComponentPropertys = {
  appController: AppController
  id: string
  isProduction: boolean
  editorStateUi: EditorStateType['ui']
}

export type NavContainerComponentPropertys = CommonComponentPropertys & {
  editorState: EditorStateType
  currentViewportElements: EditorRendererControllerType['currentViewportElements']
  COMPONENT_MODELS: EditorRendererControllerType['COMPONENT_MODELS']
  OverlayComponent?: FC<{ element: Element }>
  isPointerProduction: boolean
  icons: Record<string, string>
  selectedPageElements: EditorRendererControllerType['selectedPageElements']
  navigate: NavigateFunction
  rootCompositeElementId?: string
  onSelectElement: (element: Element, isHovering: boolean) => void
  disableOverlay?: boolean
  baseComponentId?: string
  uiActions?: any
  items: any[]
  navigationElementId: string
}
