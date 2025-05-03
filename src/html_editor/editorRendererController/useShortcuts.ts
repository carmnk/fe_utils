import { useMemo } from 'react'
import { EditorStateType } from '../types'
import { ElementModel, BASE_ELEMENT_MODELS } from '../editorComponents'
import { Element } from '../types/element'

export const getRecursiveChildren = (
  allElements: Element[],
  parentId: string,
  componentId?: string
): Element[] => {
  const children = allElements.filter(
    (el) =>
      el.parent_id === parentId &&
      (!componentId || el.component_id === componentId)
  )

  return children
    .map(
      (child) =>
        child.element_id
          ? [
              child,
              ...getRecursiveChildren(
                allElements,
                child.element_id,
                componentId
              ),
            ]
          : (null as unknown as Element) // filter later
    )
    .filter((val) => val)
    .flat()
}

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
                getRecursiveChildren(currentViewportElementsRaw, el.element_id)
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
