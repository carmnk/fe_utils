import { Element } from '../editorRendererController'

export const getRecursiveElementChildren = (
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
              ...getRecursiveElementChildren(
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
