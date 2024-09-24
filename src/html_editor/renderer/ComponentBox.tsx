import { Box } from '@mui/material'
import { EditorRendererControllerType } from '../editorRendererController/types/editorRendererController'
import { EditorStateType, Element } from '../editorRendererController/types'
import { renderElements } from './renderElements'
import { FC, useMemo } from 'react'

export type ComponentElementBoxProps<
  ControllreActionsType extends { [key: string]: any },
> = {
  element: Element
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType<ControllreActionsType>['appController']
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType<ControllreActionsType>['COMPONENT_MODELS']
  selectedElement: Element | null
  actions?: ControllreActionsType
  //
  isProduction: boolean
  OverlayComponent?: FC<{
    element: Element
    isProduction?: boolean
    editorState: EditorStateType
    actions?: ControllreActionsType
  }>
  navigate: any
}

export const ComponentBox = <
  ControllreActionsType extends { [key: string]: any },
>(
  props: ComponentElementBoxProps<ControllreActionsType>
) => {
  const {
    element,
    editorState,
    appController,
    currentViewportElements,
    actions,
    selectedPageElements,
    COMPONENT_MODELS,
    selectedElement,
    isProduction,
    OverlayComponent,
    navigate,
  } = props

  const rootElementOverlayProps = useMemo(
    () => ({
      element,
      isProduction,
      editorState,
      actions,
    }),
    [element, isProduction, editorState, actions]
  )

  const renderedComponentElements = useMemo(
    () =>
      renderElements({
        elements: editorState.elements.filter(
          (el) =>
            el.component_id === element.ref_component_id &&
            element?.ref_component_id &&
            element.component_id &&
            (el?._type !== 'composite' ||
              (el._type === 'composite' &&
                el.component_id !== el.ref_component_id)) &&
            !el?._parentId
        ),
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
        selectedElement,
        actions,
        onSelectElement: () => {},
        theme: editorState.theme,
        isProduction,
        icons: [] as any,
        parentId: null as any, // start with the elements without parent !
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
      selectedElement,
      actions,
      isProduction,
      OverlayComponent,
      navigate,
      element,
    ]
  )

  return (
    <Box position="relative">
      {renderedComponentElements}
      {OverlayComponent && <OverlayComponent {...rootElementOverlayProps} />}
    </Box>
  )
}