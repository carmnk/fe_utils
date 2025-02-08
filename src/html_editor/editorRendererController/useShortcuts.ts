import { useMemo } from 'react'
import { EditorStateType } from '../types'
import { ElementModel, BASE_ELEMENT_MODELS } from '../editorComponents'

export const useShortcuts = (params: {
  editorState: EditorStateType
  customComponents?: ElementModel[]
}) => {
  const { editorState, customComponents } = params

  const currentViewportElements = useMemo(() => {
    const currentViewport = editorState.ui.selected.viewport
    const currentViewportElements =
      currentViewport === 'xs'
        ? editorState.elements
        : editorState.alternativeViewports[currentViewport]
    if (currentViewport === 'xs') return editorState.elements
    return currentViewportElements?.length
      ? currentViewportElements
      : editorState.elements
  }, [
    editorState.elements,
    editorState.alternativeViewports,
    editorState.ui.selected.viewport,
  ])

  const selectedElement = useMemo(() => {
    const id = editorState?.ui.selected.element
    return (
      currentViewportElements?.find((el) => el.element_id === id && id) ?? null
    )
  }, [editorState.ui.selected.element, currentViewportElements])

  const selectedPageElements = useMemo(() => {
    const selectedPage = editorState.ui.selected.page
    return (
      currentViewportElements?.filter(
        (el) => el.element_page === selectedPage
      ) ?? []
    )
  }, [editorState.ui.selected.page, currentViewportElements])

  const ELEMENT_MODELS = useMemo(
    () => [...BASE_ELEMENT_MODELS, ...(customComponents ?? [])],
    [customComponents]
  )

  const shortcuts = useMemo(() => {
    return {
      currentViewportElements,
      selectedPageElements,
      selectedElement,
      ELEMENT_MODELS,
    }
  }, [
    currentViewportElements,
    selectedElement,
    selectedPageElements,
    ELEMENT_MODELS,
  ])

  return shortcuts
}
