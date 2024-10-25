import { Theme } from '@mui/material'
import {
  AppController,
  EditorRendererControllerType,
  EditorStateType,
  Element,
  Property,
} from '../editorRendererController'
import { renderElements } from './renderElements'
import { NavigateFunction } from 'react-router-dom'

export type RenderElementChildrenParams = {
  element: Element
  elementProps: Property[]
  editorState: EditorStateType
  appController: AppController
  theme: Theme
  currentViewportElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType<object>['COMPONENT_MODELS']
  selectedPageElements: Element[]
  uiActions: any
  baseComponentId?: string
  selectedElement: Element | null
  onSelectElement: (element: Element, isHovering: boolean) => void
  isProduction?: boolean
  isPointerProduction?: boolean
  disableOverlay?: boolean
  icons: any
  rootCompositeElementId?: string
  OverlayComponent?: any
  navigate: NavigateFunction
}

export const renderElementChildren = (params: RenderElementChildrenParams) => {
  const {
    element,
    elementProps,
    editorState,
    appController,
    theme,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    uiActions,
    selectedElement,
    baseComponentId,
    onSelectElement,
    isProduction,
    icons,
    isPointerProduction,
    disableOverlay,
    rootCompositeElementId,
    OverlayComponent,
    navigate,
  } = params

  const getPropByName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.prop_value

  const elementChildren =
    (baseComponentId ? editorState.elements : currentViewportElements)?.filter(
      (el) => el._parentId === element._id && element._id
    ) ?? []

  const navContainerChildren =
    element?._type === ('NavContainer' as any)
      ? (() => {
          const sourceControlElementId = getPropByName('navigationElementId')
          // ?.navigationElementId

          if (!sourceControlElementId) return []
          const sourceControlElement = currentViewportElements?.find(
            (el) => el._id === sourceControlElementId
          )
          const activeTab =
            sourceControlElement?._type === 'Button'
              ? (appController?.state?.buttonStates?.[sourceControlElementId] ??
                false)
              : appController?.state?.[sourceControlElementId]
          const activeId = getPropByName('items')?.find(
            (item: any) => item.value === activeTab
          )?.childId
          const activeChild = elementChildren?.find?.(
            (child) => child._id === activeId
          )
          const children = activeChild ? [activeChild] : []
          return children
        })()
      : []

  const children = navContainerChildren?.length
    ? navContainerChildren
    : elementChildren

  const renderedElementChildren = children?.length
    ? renderElements({
        elements: children,
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
        selectedElement,
        uiActions,
        onSelectElement,
        theme,
        isProduction,
        icons,
        parentId: element._id,
        isPointerProduction,
        baseComponentId,
        disableOverlay,
        rootCompositeElementId,
        OverlayComponent,
        navigate,
        debug:
          element?._id === 'e9780d0e-c07b-4b1b-90ba-5562f7915e65'
            ? true
            : undefined,
      })
    : []

  return renderedElementChildren
}
