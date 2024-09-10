import { Box } from '@mui/material'
import { EditorRendererControllerType } from '../editorRendererController/editorRendererControllerTypes'
import {
  EditorStateType,
  ElementType,
} from '../editorRendererController/editorState'
import { renderElements } from './renderElements'
import { NavigateFunction } from 'react-router-dom'

export type ComponentElementBoxProps<
  ControllreActionsType extends { [key: string]: any },
> = {
  element: ElementType
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType<ControllreActionsType>['appController']
  currentViewportElements: ElementType[]
  selectedPageElements: ElementType[]
  COMPONENT_MODELS: EditorRendererControllerType<ControllreActionsType>['COMPONENT_MODELS']
  selectedElement: ElementType | null
  actions?: ControllreActionsType
  //
  isProduction: boolean
  OverlayComponent?: React.FC<{
    element: ElementType
    isProduction?: boolean
    editorState: EditorStateType
    actions?: ControllreActionsType
  }>
  navigate: NavigateFunction
}

export const ComponentElementBox = <
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

  const rootElementOverlayProps = {
    element,
    isProduction,
    editorState,
    actions,
  }

  return (
    <Box position="relative">
      {renderElements({
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
      })}
      {OverlayComponent && <OverlayComponent {...rootElementOverlayProps} />}
    </Box>
  )
}