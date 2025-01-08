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
import { FC } from 'react'

export type RenderElementChildrenParams = {
  uiActions?: unknown

  element: Element
  // elementProps: Property[]
  editorState: EditorStateType
  appController: AppController
  theme: Theme
  currentViewportElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType['COMPONENT_MODELS']
  selectedPageElements: Element[]
  baseComponentId?: string
  onSelectElement: (element: Element, isHovering: boolean) => void
  isProduction?: boolean
  isPointerProduction?: boolean
  disableOverlay?: boolean
  icons: Record<string, string>
  rootCompositeElementId?: string
  OverlayComponent?: FC<{ element: Element }>
  navigate: NavigateFunction
}

export const renderElementChildren = (params: RenderElementChildrenParams) => {
  const {
    element,
    // elementProps,
    editorState,
    appController,
    theme,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    uiActions,
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

  // const getPropByName = (key: string) =>
  //   elementProps?.find((prop) => prop.prop_name === key)?.prop_value

  const elementChildren =
    (baseComponentId ? editorState.elements : currentViewportElements)?.filter(
      (el) => el._parentId === element._id && element._id
    ) ?? []

  // const navContainerChildren =
  //   element?._type === 'NavContainer'
  //     ? (() => {
  //         const sourceControlElementId = getPropByName('navigationElementId')
  //         // ?.navigationElementId

  //         if (!sourceControlElementId) return []
  //         const sourceControlElement = currentViewportElements?.find(
  //           (el) => el._id === sourceControlElementId
  //         )
  //         const activeTab =
  //           sourceControlElement?._type === 'Button'
  //             ? (appController?.state?.buttonStates?.[
  //                 sourceControlElementId as string
  //               ] ?? false)
  //             : appController?.state?.[sourceControlElementId as string]
  //         const itemsValue = getPropByName('items')
  //         const activeId = (Array.isArray(itemsValue) ? itemsValue : [])?.find(
  //           (item: { value: string; childId: string }) =>
  //             item.value === activeTab
  //         )?.childId
  //         const activeChild = elementChildren?.find?.(
  //           (child) => child._id === activeId
  //         )
  //         const children = activeChild ? [activeChild] : []
  //         return children
  //       })()
  //     : []

  // const children =
  //   element?._type === 'NavContainer' ? navContainerChildren : elementChildren

  const renderedElementChildren = elementChildren?.length
    ? renderElements({
        elements: elementChildren,
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
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
        debug: true,
      })
    : []

  return renderedElementChildren
}
