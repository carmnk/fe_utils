import { Box, Theme, ThemeProvider } from '@mui/material'
import { SetStateAction, Dispatch, FC, memo } from 'react'
import { useEffect, useMemo, useCallback } from 'react'
import { renderElements } from './renderElements'
import { useMdiIcons } from './icons/useMdiIcons'
import { EditorStateType, Element } from '../types'
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
  COMPONENT_MODELS: EditorRendererControllerType['COMPONENT_MODELS']
  appController: EditorRendererControllerType['appController']
  pageName: string //const pageName = location.pathname.slice(1) || 'index'
  navigate: NavigateFunction
  isInHelpMode?: boolean
  isInHelpModeSelected?: boolean
  id?: string
  injectElementAtEnd?: React.ReactNode
  injectElementInContainerStart?: React.ReactNode
  importIconByName: (name: string) => Promise<string>
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
    appController,
    pageName,
    navigate,
    isInHelpMode,
    isInHelpModeSelected,
    id,
    injectElementAtEnd,
    injectElementInContainerStart,
    importIconByName,
  } = props

  const selectElement = uiActions?.selectElement
  const themeAdj = theme ?? editorState.theme

  const [icons] = useMdiIcons(
    selectedPageElements,
    COMPONENT_MODELS,
    editorState.properties,
    importIconByName
  )

  const handleSelectElement = useCallback(
    (element: Element, boundingRect: unknown) => {
      if (isProduction) {
        return
      }
      if (!element?.element_id) return
      selectElement?.(element.element_id, boundingRect)
    },
    [selectElement, isProduction]
  )

  const renderPage = useCallback(
    (page: string) => {
      const pageElements = currentViewportElements.filter(
        (el) => el.element_page === page
      )
      return renderElements({
        elements: pageElements,
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
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
          {injectElementInContainerStart}
          {renderedCurrentPageElements}
        </Box>
      )}
      {injectElementAtEnd}
    </ThemeProvider>
  )
}
export const HtmlRenderer = memo(HtmlRendererComponent)
HtmlRenderer.displayName = 'HtmlRenderer'
