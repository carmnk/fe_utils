import { Box } from '@mui/material'
import { EditorRendererControllerType } from '../types/editorRendererController'
import { EditorStateType, Element } from '../types'
import { renderElements } from './renderElements'
import { FC, useMemo } from 'react'

export type ComponentElementBoxProps = {
  element: Element
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType['appController']
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  ELEMENT_MODELS: EditorRendererControllerType['ELEMENT_MODELS']
  selectedElement: Element | null
  uiActions?: unknown
  //
  isProduction: boolean
  OverlayComponent?: FC<{ element: Element }>
  navigate: (to: string) => void
  rootCompositeElementId?: string
  icons: Record<string, string>
}

export const ComponentBox = (props: ComponentElementBoxProps) => {
  const {
    element,
    editorState,
    appController,
    currentViewportElements,
    uiActions,
    ELEMENT_MODELS,
    isProduction,
    OverlayComponent,
    navigate,
    icons,
    // rootCompositeElementId,
  } = props

  const renderedComponentElements = useMemo(
    () =>
      renderElements({
        elements: editorState.elements.filter(
          (el) =>
            (el.element_type !== 'composite' &&
              el.component_id === element.component_id) ||
            (el.component_id === element.ref_component_id &&
              element?.ref_component_id &&
              (el?.element_type !== 'composite' ||
                (el.element_type === 'composite' &&
                  el.component_id !== el.ref_component_id)) &&
              !el?.parent_id)
        ),
        editorState,
        appController,
        currentViewportElements,
        ELEMENT_MODELS,
        uiActions,
        onSelectElement: () => {},
        theme: editorState.theme,
        isProduction,
        icons,
        parentId: undefined, // start with the elements without parent !
        isPointerProduction: true,
        baseComponentId:
          element?.ref_component_id ?? element?.component_id ?? undefined,
        disableOverlay: true,
        rootCompositeElementId: element.element_id,
        OverlayComponent: OverlayComponent,
        navigate,
      }),
    [
      icons,
      editorState,
      appController,
      currentViewportElements,
      ELEMENT_MODELS,
      uiActions,
      isProduction,
      OverlayComponent,
      navigate,
      element,
    ]
  )
  return (
    <Box position="relative">
      {renderedComponentElements}
      {OverlayComponent && !isProduction && (
        <OverlayComponent element={element} />
      )}
    </Box>
  )
}
