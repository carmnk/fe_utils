import { EditorStateType, Element } from '../../editorRendererController'
import { getAdaptiveReferenceViewports } from './getAdaptiveReferfenceViewports'

export const doesElementChildrenBelongToViewport = (
  element: Element,
  currentViewport: string,
  isCurrentViewportAutarkic: boolean | undefined,
  allElements: Element[],
  viewport_references: EditorStateType['viewport_references']
) => {
  return (
    ((!currentViewport || currentViewport === 'xs') &&
      (!element.viewport || element.viewport === 'xs')) ||
    (isCurrentViewportAutarkic && element.viewport === currentViewport) ||
    (() => {
      if (
        !currentViewport ||
        currentViewport === 'xs' ||
        isCurrentViewportAutarkic
      )
        return false
      const adaptiveReferenceViewports = getAdaptiveReferenceViewports(
        currentViewport,
        viewport_references
      )
      const elementsAcrossViewports = allElements.filter(
        (el) => el.parent_id === (element as Element)?.parent_id
      )
      const higherPrioViewports = adaptiveReferenceViewports.slice(
        0,
        adaptiveReferenceViewports.findIndex((vp) => vp === element.viewport)
      )
      const doesElementWithHigherPrioExist = higherPrioViewports.find((vp) =>
        elementsAcrossViewports.find((el) => el.viewport === vp)
      )

      // if viewport specific children then only show them otherwise adaptive with default
    //   const parentElementId = parentElement?.element_id ?? null
      const hasSpecificViewportChildren = elementsAcrossViewports?.find((el) =>
        adaptiveReferenceViewports.includes(el?.viewport ?? 'xs')
      )
      return doesElementWithHigherPrioExist
        ? false
        : hasSpecificViewportChildren
          ? adaptiveReferenceViewports.includes(element.viewport ?? 'xs')
          : !element.viewport || element.viewport === 'xs'
    })()
  )
}
