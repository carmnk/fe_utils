import { Box, Theme, ThemeProvider } from '@mui/material'
import { SetStateAction, Dispatch, FC } from 'react'
import { useEffect, useMemo, useCallback } from 'react'
import { renderElements } from './renderElements'
import { NavigateFunction } from 'react-router-dom'
import { uniq } from 'lodash'
import { useMdiIcons } from './icons/useMdiIcons'
import {
  EditorStateType,
  ElementType,
} from '../editorRendererController/editorState'
import { useWindowSize } from '../../hooks/useWindowSize'
import { EditorRendererControllerType } from '../editorRendererController'

// -> must be generated dynamically!
// import siteProps from '../site_props.json'

export type HtmlRendererProps<
  ControllreActionsType extends { [key: string]: any },
> = {
  isProduction?: boolean
  theme: Theme
  OverlayComponent?: FC<{
    element: ElementType
    isProduction?: boolean
    editorState: EditorStateType
    actions?: ControllreActionsType
  }>
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  currentViewportElements: ElementType[]
  selectedPageElements: ElementType[]
  actions?: ControllreActionsType
  COMPONENT_MODELS: EditorRendererControllerType<ControllreActionsType>['COMPONENT_MODELS']
  selectedElement: ElementType | null
  appController: EditorRendererControllerType<ControllreActionsType>['appController']
  pageName: string //const pageName = location.pathname.slice(1) || 'index'
  navigate: NavigateFunction
}

export const HtmlRenderer = <
  ControllreActionsType extends { [key: string]: any },
>(
  props: HtmlRendererProps<ControllreActionsType>
) => {
  const {
    isProduction,
    theme,
    OverlayComponent,
    editorState,
    setEditorState,
    currentViewportElements,
    selectedPageElements,
    actions,
    COMPONENT_MODELS,
    selectedElement,
    appController,
    pageName,
    navigate,
  } = props

  const selectElement = actions?.ui.selectElement

  const icons = useMdiIcons(
    selectedPageElements,
    COMPONENT_MODELS,
    editorState.properties
  )

  const handleSelectElement = useCallback(
    (element: ElementType, boundingRect: any) => {
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
        actions,
        onSelectElement: handleSelectElement,
        theme,
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
      editorState,
      appController,
      currentViewportElements,
      selectedPageElements,
      COMPONENT_MODELS,
      selectedElement,
      actions,
      handleSelectElement,
      icons,
      theme,
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

  const remainingPages = useMemo(() => {
    if (!isProduction) {
      return []
    }
    const pages = uniq(currentViewportElements?.map((el) => el._page) ?? [])
    const pagesExIndex = pages.filter((page) => page !== 'index')
    return pagesExIndex
  }, [currentViewportElements, isProduction])

  const renderedCurrentPageElements = useMemo(() => {
    return isProduction || !editorState.ui.selected.page
      ? null
      : renderPage(editorState.ui.selected.page)
  }, [editorState.ui.selected.page, isProduction, renderPage])

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
    <ThemeProvider theme={theme ?? editorState.theme}>
      {isProduction ? (
        <Box
          height="100%"
          bgcolor="background.default"
          color={'text.primary'}
          sx={containerStyles}
        >
          {renderPage(pageName)}
          {/* <Routes>
            <Route path="/" element={renderPage('index')} />
            {remainingPages?.map((pageName: any) => (
              <Route
                key={pageName}
                path={`/${pageName}`}
                element={renderPage(pageName)}
              />
            ))}
          </Routes> */}
        </Box>
      ) : (
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
        >
          {renderedCurrentPageElements}
        </Box>
      )}
    </ThemeProvider>
  )
}