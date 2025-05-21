import { useMemo } from 'react'
import { EditorStateType } from '../types'
import { ElementModel, BASE_ELEMENT_MODELS } from '../editorComponents'
import { getRecursiveElementChildren } from '../utils'

export const useShortcuts = (params: {
  editorState: EditorStateType
  customComponents?: ElementModel[]
}) => {
  const { editorState, customComponents } = params

  const currentViewportElements = useMemo(() => {
    const currentViewport = editorState.ui.selected.viewport
    const currentViewportElementsRaw =
      currentViewport === 'xs'
        ? editorState.elements
        : editorState.alternativeViewports[currentViewport]

    if (currentViewport === 'xs') return editorState.elements
    const hasViewportRootElement = currentViewportElementsRaw.find(
      (el) => !el.parent_id && !el.component_id
    )
    return hasViewportRootElement
      ? currentViewportElementsRaw
      : (() => {
          const adaptiveViewportElements = editorState.elements
            .map((el) => {
              const recursiveSpecificViewportElementChildren =
                getRecursiveElementChildren(
                  currentViewportElementsRaw,
                  el.element_id
                )
              return [el, ...(recursiveSpecificViewportElementChildren ?? [])]
            })
            .flat()
          return adaptiveViewportElements
        })()
  }, [
    editorState.elements,
    editorState.alternativeViewports,
    editorState.ui.selected.viewport,
  ])
  const allElements = useMemo(() => {
    const xsAndComponentElements = editorState.elements
    const viewportSpecificElements = [
      ...editorState.alternativeViewports['sm'],
      ...editorState.alternativeViewports['md'],
      ...editorState.alternativeViewports['lg'],
      ...editorState.alternativeViewports['xl'],
    ]
    return [...xsAndComponentElements, ...viewportSpecificElements]
  }, [editorState.elements, editorState.alternativeViewports])

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
      allElements,
    }
  }, [
    currentViewportElements,
    selectedElement,
    selectedPageElements,
    ELEMENT_MODELS,
    allElements,
  ])

  return shortcuts
}
