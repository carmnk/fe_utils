import { Box } from '@mui/material'
import { EditorRendererControllerType } from '../editorRendererController/types/editorRendererController'
import { EditorStateType, Element } from '../editorRendererController/types'
import { renderElements } from './renderElements'
import { FC, useMemo } from 'react'
import { NavigateFunction } from 'react-router-dom'

export type ComponentElementBoxProps = {
  element: Element
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType['appController']
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType['COMPONENT_MODELS']
  selectedElement: Element | null
  uiActions?: unknown
  //
  isProduction: boolean
  OverlayComponent?: FC<{ element: Element }>
  navigate: NavigateFunction
  rootCompositeElementId?: string
}

export const ComponentBox = (props: ComponentElementBoxProps) => {
  const {
    element,
    editorState,
    appController,
    currentViewportElements,
    uiActions,
    selectedPageElements,
    COMPONENT_MODELS,
    isProduction,
    OverlayComponent,
    navigate,
    // rootCompositeElementId,
  } = props

  console.debug(
    'COMPONENT ELEMENTS',
    editorState.elements.filter(
      (el) =>
        (el._type !== 'composite' &&
          el.component_id === element.component_id) ||
        (el.component_id === element.ref_component_id &&
          element?.ref_component_id &&
          element.component_id &&
          (el?._type !== 'composite' ||
            (el._type === 'composite' &&
              el.component_id !== el.ref_component_id)) &&
          !el?._parentId)
    ),
    'component_id',
    element?.ref_component_id ?? element?.component_id ?? undefined,
    isProduction
  )
  const renderedComponentElements = useMemo(
    () =>
      renderElements({
        elements: editorState.elements.filter(
          (el) =>
            (el._type !== 'composite' &&
              el.component_id === element.component_id) ||
            (el.component_id === element.ref_component_id &&
              element?.ref_component_id &&
              element.component_id &&
              (el?._type !== 'composite' ||
                (el._type === 'composite' &&
                  el.component_id !== el.ref_component_id)) &&
              !el?._parentId)
        ),
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
        uiActions,
        onSelectElement: () => {},
        theme: editorState.theme,
        isProduction,
        icons: {},
        parentId: undefined, // start with the elements without parent !
        isPointerProduction: true,
        baseComponentId:
          element?.ref_component_id ?? element?.component_id ?? undefined,
        disableOverlay: true,
        rootCompositeElementId: element._id,
        OverlayComponent: OverlayComponent,
        navigate,
      }),
    [
      editorState,
      appController,
      currentViewportElements,
      selectedPageElements,
      COMPONENT_MODELS,
      uiActions,
      isProduction,
      OverlayComponent,
      navigate,
      element,
    ]
  )
  return (
    <Box position="relative" onLoadStart={() => {}}>
      {renderedComponentElements}
      {OverlayComponent && <OverlayComponent element={element} />}
    </Box>
  )
}
