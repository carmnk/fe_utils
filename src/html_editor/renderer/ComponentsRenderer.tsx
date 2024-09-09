import { ThemeProvider } from '@emotion/react'
import { Box, Typography, useTheme } from '@mui/material'
import { useCallback, useMemo } from 'react'
import { renderElements } from './renderElements'
import { EditorRendererControllerType } from '../editorRendererController/editorRendererControllerTypes'
import { EditorStateType, GenericElementType } from '../editorRendererController'
import { RootElementOverlay } from './RootElementOverlay'

export type ComponentsRendererProps<
  ControllreActionsType extends { [key: string]: any },
> = {
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType<ControllreActionsType>['appController']
  currentViewportElements: GenericElementType[]
  selectedPageElements: GenericElementType[]
  COMPONENT_MODELS: EditorRendererControllerType<ControllreActionsType>['COMPONENT_MODELS']
  selectedElement: GenericElementType
  actions?: ControllreActionsType
  getRecursiveChildren: EditorRendererControllerType<ControllreActionsType>['getRecursiveChildren']
  //
  icons: Record<string, string>
}

export const ComponentsRenderer = <
  ControllreActionsType extends { [key: string]: any },
>(
  props: ComponentsRendererProps<ControllreActionsType>
) => {
  const theme = useTheme()
  const {
    editorState,
    appController,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    selectedElement,
    actions,
    icons,
    getRecursiveChildren,
  } = props

  const selectedComponentUi = editorState.ui.selected.component
  const componentId =
    editorState.components.find(
      (comp) => comp.component_id === selectedComponentUi
    )?.component_id ||
    editorState.elements.find((el) => el._id === selectedComponentUi)
      ?.component_id
  const component = editorState.components.find(
    (comp) => comp.component_id === componentId
  )
  const componentElements = useMemo(() => {
    const selectedSubElement = editorState.elements.find(
      (el) => el._id === editorState.ui.selected.component
    )

    const directComponentElements = editorState.elements.filter(
      (el) =>
        el.component_id === editorState.ui.selected.component ||
        selectedSubElement?.component_id === el.component_id ||
        el._type === 'composite'
    )
    const indirectComponentElements = directComponentElements
      .map((directEl) =>
        getRecursiveChildren(editorState.elements, directEl._id)
      )
      .flat()
    return [...directComponentElements, ...indirectComponentElements]
  }, [
    editorState.elements,
    editorState.ui.selected.component,
    getRecursiveChildren,
  ])

  const containerStyles = useMemo(() => {
    return {
      overflowY: 'auto',
      cursor:
        editorState?.ui?.dragging && editorState.ui.dragMode === 'reorder'
          ? 'grabbing'
          : ['margin', 'padding'].includes(editorState.ui.dragMode) &&
              ['top', 'bottom'].includes(
                editorState.ui.selected.hoveredElementSide ?? ''
              )
            ? 'ns-resize'
            : ['margin', 'padding'].includes(editorState.ui.dragMode) &&
                ['left', 'right'].includes(
                  editorState.ui.selected.hoveredElementSide ?? ''
                )
              ? 'ew-resize'
              : 'default',
    }
  }, [
    editorState?.ui?.dragging,
    editorState.ui?.dragMode,
    editorState.ui?.selected?.hoveredElementSide,
  ])

  const renderComponentElements = useCallback(() => {
    return component?.component_name
      ? renderElements({
          elements: componentElements,
          editorState,
          appController,
          currentViewportElements,
          selectedPageElements,
          COMPONENT_MODELS,
          selectedElement,
          actions,
          onSelectElement: () => {},
          theme,
          isProduction: true,
          icons,
          parentId: undefined,
          isPointerProduction: true,
          baseComponentId: componentId as any,
          OverlayComponent: RootElementOverlay,
        })
      : editorState.components.map((comp) => {
          return (
            <Box border="1px solid #666" mb={2}>
              <Box pb={1}>
                <Typography fontWeight={'bold'}>
                  {comp.component_name}:
                </Typography>
              </Box>
              <Box border="1px dashed #666">
                {renderElements({
                  elements: editorState.elements.filter(
                    (el) =>
                      !el._parentId && el.component_id === comp.component_id
                  ),
                  // .filter(
                  //   (el) =>
                  //     el.component_id === comp.component_id ||
                  //     el._type === 'composite'
                  // )
                  editorState,
                  appController,
                  currentViewportElements,
                  selectedPageElements,
                  COMPONENT_MODELS,
                  selectedElement,
                  actions,
                  onSelectElement: () => {},
                  theme,
                  isProduction: true,
                  icons,
                  parentId: undefined,
                  isPointerProduction: true,
                  baseComponentId: comp.component_id as any,
                  OverlayComponent: RootElementOverlay,
                })}
              </Box>
            </Box>
          )
        })
  }, [
    editorState,
    appController,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    selectedElement,
    actions,
    icons,
    theme,
    componentElements,
    componentId,
    component?.component_name,
  ])

  return (
    <ThemeProvider theme={editorState.theme}>
      <Box
        zIndex={10} // for preview mode -> must be on top of the right menu
        flexGrow={1}
        bgcolor={'background.default'}
        color={'text.primary'}
        overflow={'auto'}
        position={editorState.ui.previewMode ? 'absolute' : 'relative'}
        width={editorState.ui.previewMode ? '100%' : undefined}
        height={editorState.ui.previewMode ? '100%' : undefined}
        sx={containerStyles}
        p={2}
      >
        <Box>
          <Typography variant="h6">
            {component?.component_name
              ? `Component: ${component?.component_name}`
              : 'Components'}
          </Typography>
        </Box>

        <Box p={1} border={'1px dotted white'}>
          <Box>{renderComponentElements()}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
