import { Element } from '../editorRendererController'

export const getRecursiveElementParents = (
  allElements: Element[],
  elementId: string
  // componentId?: string
): Element[] => {
  const parentElementId = allElements.find(
    (el) => el.element_id === elementId
  )?.parent_id
  if (!parentElementId) {
    return []
  }
  const parentElement = allElements.find(
    (el) => el.element_id === parentElementId
  ) as Element

  return [
    parentElement,
    ...getRecursiveElementParents(allElements, parentElementId),
  ].filter((val) => val)
}
