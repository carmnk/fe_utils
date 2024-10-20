import { Box, Theme, ThemeProvider } from '@mui/material'
import { SetStateAction, Dispatch, FC, memo } from 'react'
import { useEffect, useMemo, useCallback } from 'react'
import { renderElements } from './renderElements'
import { useMdiIcons } from './icons/useMdiIcons'
import { EditorStateType, Element } from '../editorRendererController/types'
import { useWindowSize } from '../../hooks/useWindowSize'
import { EditorRendererControllerType } from '../editorRendererController'
import { NavigateFunction } from 'react-router-dom'

type RendererUiActionsType = {
  selectElement?: (elementId: string, boundingRect: unknown) => void
}

export type HtmlRendererProps<UiActionsType extends RendererUiActionsType> = {
  isProduction?: boolean
  theme: Theme
  OverlayComponent?: FC<{ element: Element }>
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  uiActions?: UiActionsType
  COMPONENT_MODELS: EditorRendererControllerType<UiActionsType>['COMPONENT_MODELS']
  selectedElement: Element | null
  appController: EditorRendererControllerType<UiActionsType>['appController']
  pageName: string //const pageName = location.pathname.slice(1) || 'index'
  navigate: NavigateFunction
  isInHelpMode?: boolean
  isInHelpModeSelected?: boolean
  id?: string
  injectElementAtEnd?: React.ReactNode
}

export const HtmlRendererComponent = <
  UiActionsType extends RendererUiActionsType,
>(
  props: HtmlRendererProps<UiActionsType>
) => {
  const {
    isProduction,
    theme,
    OverlayComponent,
    editorState,
    setEditorState,
    currentViewportElements,
    selectedPageElements,
    uiActions,
    COMPONENT_MODELS,
    selectedElement,
    appController,
    pageName,
    navigate,
    isInHelpMode,
    isInHelpModeSelected,
    id,
    injectElementAtEnd,
  } = props

  const selectElement = uiActions?.selectElement
  const themeAdj = theme ?? editorState.theme

  const [icons] = useMdiIcons(
    selectedPageElements,
    COMPONENT_MODELS,
    editorState.properties
  )

  const handleSelectElement = useCallback(
    (element: Element, boundingRect: unknown) => {
      if (isProduction) {
        return
      }
      if (!element?._id) return
      selectElement?.(element._id, boundingRect)
    },
    [selectElement, isProduction]
  )

  const renderPage = useCallback(
    (page: string) => {
      const pageElements = currentViewportElements.filter(
        (el) => el._page === page
      )
      return renderElements({
        elements: pageElements,
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
        selectedElement,
        uiActions: uiActions,
        onSelectElement: handleSelectElement,
        theme: themeAdj,
        isProduction,
        icons,
        isPointerProduction: isProduction
          ? undefined
          : editorState.ui.pointerMode === 'production',
        OverlayComponent: OverlayComponent,
        navigate,
      })
    },
    [
      uiActions,
      editorState,
      appController,
      currentViewportElements,
      selectedPageElements,
      COMPONENT_MODELS,
      selectedElement,
      handleSelectElement,
      icons,
      themeAdj,
      isProduction,
      OverlayComponent,
      navigate,
    ]
  )

  // change the route, renderer uses editorState.ui.selected.page to render the page
  useEffect(() => {
    if (!isProduction) {
      return
    }

    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selected: { ...current.ui.selected, page: pageName },
      },
    }))
  }, [isProduction, setEditorState, pageName])

  const renderedCurrentPageElements = useMemo(() => {
    return isProduction || !editorState.ui.selected.page
      ? null
      : renderPage(editorState.ui.selected.page)
  }, [editorState.ui.selected.page, isProduction, renderPage])

  const containerStyles = useMemo(() => {
    return {
      overflowY: 'auto',
      overflowX: editorState.ui.viewportLimitsMode ? 'hidden' : 'auto',
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
      border: isInHelpMode
        ? '3px solid limegreen'
        : (undefined as unknown as string),

      backgroundSize: editorState.ui.rulerMode
        ? '50px 50px'
        : (undefined as unknown as string),
      backgroundImage: editorState.ui.rulerMode
        ? 'linear-gradient(to right, grey 1px, transparent 1px), linear-gradient(to bottom, grey 1px, transparent 1px)'
        : (undefined as unknown as string),
      // background: editorState.ui.rulerMode
      //   ? undefined
      //   : (containerStyles.background as any),
    }
  }, [
    editorState?.ui?.dragging,
    editorState.ui?.dragMode,
    editorState.ui?.selected?.hoveredElementSide,
    isInHelpMode,
    editorState.ui.rulerMode,
    editorState.ui.viewportLimitsMode,
  ])

  const windowSize = useWindowSize()

  useEffect(() => {
    if (!isProduction) {
      return
    }
    const breakpointValues = editorState.theme.breakpoints.values
    const viewportSize =
      windowSize.width < breakpointValues.sm
        ? 'xs'
        : windowSize.width < breakpointValues.md
          ? 'sm'
          : windowSize.width < breakpointValues.lg
            ? 'md'
            : windowSize.width < breakpointValues.xl
              ? 'lg'
              : 'xl'

    setEditorState((current) => ({
      ...current,
      ui: {
        ...current.ui,
        selected: {
          ...current.ui.selected,
          viewport: viewportSize,
        },
      },
    }))
  }, [
    windowSize,
    isProduction,
    editorState?.theme?.breakpoints?.values,
    setEditorState,
  ])

  const selectedViewport = editorState.ui.selected.viewport
  const viewportLowerWidthLimit =
    selectedViewport === 'xl'
      ? theme.breakpoints.values.xl
      : selectedViewport === 'lg'
        ? theme.breakpoints.values.lg
        : selectedViewport === 'md'
          ? theme.breakpoints.values.md
          : selectedViewport === 'sm'
            ? theme.breakpoints.values.sm
            : theme.breakpoints.values.xs

  const viewportUpperWidthLimit =
    selectedViewport === 'xl'
      ? null
      : selectedViewport === 'lg'
        ? theme.breakpoints.values.xl
        : selectedViewport === 'md'
          ? theme.breakpoints.values.lg
          : selectedViewport === 'sm'
            ? theme.breakpoints.values.md
            : theme.breakpoints.values.sm

  return (
    <ThemeProvider theme={themeAdj}>
      {isProduction ? (
        <Box
          height="100%"
          bgcolor="background.default"
          color={'text.primary'}
          sx={containerStyles}
          id={id}
        >
          {editorState.ui.viewportLimitsMode &&
            typeof viewportLowerWidthLimit === 'number' && (
              <Box
                width={'6px'}
                bgcolor={'primary.main'}
                height="100%"
                position="absolute"
                left={viewportLowerWidthLimit - 3}
                top={0}
              />
            )}
          {editorState.ui.viewportLimitsMode &&
            typeof viewportUpperWidthLimit === 'number' && (
              <Box
                width={'6px'}
                bgcolor={'secondary.main'}
                height="100%"
                position="absolute"
                left={viewportUpperWidthLimit - 3}
                top={0}
              />
            )}
          {renderPage(pageName)}
        </Box>
      ) : (
        <Box
          id={id}
          zIndex={10} // for preview mode -> must be on top of the right menu
          flexGrow={1}
          bgcolor={isInHelpModeSelected ? '#32CD3233' : 'background.default'}
          color={'text.primary'}
          overflow={'auto'}
          position={editorState.ui.previewMode ? 'absolute' : 'relative'}
          width={editorState.ui.previewMode ? '100%' : undefined}
          height={editorState.ui.previewMode ? '100%' : undefined}
          sx={containerStyles}
        >
          {editorState.ui.viewportLimitsMode &&
            typeof viewportLowerWidthLimit === 'number' && (
              <Box
                width={'6px'}
                bgcolor={'primary.main'}
                height="100%"
                position="absolute"
                left={viewportLowerWidthLimit - 3}
                top={0}
              />
            )}
          {editorState.ui.viewportLimitsMode &&
            typeof viewportUpperWidthLimit === 'number' && (
              <Box
                width={'6px'}
                bgcolor={'secondary.main'}
                height="100%"
                position="absolute"
                left={viewportUpperWidthLimit - 3}
                top={0}
              />
            )}
          {renderedCurrentPageElements}
        </Box>
      )}
      {injectElementAtEnd}
    </ThemeProvider>
  )
}
export const HtmlRenderer = memo(HtmlRendererComponent)
HtmlRenderer.displayName = 'HtmlRenderer'
