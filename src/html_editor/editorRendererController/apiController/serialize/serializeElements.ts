import { EditorStateType, Element } from '../..'

export const serializeElements = (
  elements: Element[],
  alternativeViewports: EditorStateType['alternativeViewports'],
  project_id: string
) => {
  const elementsInBaseViewport =
    elements?.map((el) => ({ ...el, viewport: null })) || []

  const alternativeVewportKeys = Object.keys(alternativeViewports || {})
  const elementsInOtherViewports = alternativeVewportKeys
    .map(
      (viewportKey) =>
        alternativeViewports?.[
          viewportKey as keyof typeof alternativeViewports
        ]?.map((el) => ({ ...el, viewport: viewportKey })) || []
    )
    .flat()
  const elementsIn = [...elementsInBaseViewport, ...elementsInOtherViewports]

  const elementsOut = elementsIn.map((element) => {
    return {
      element_id: element.element_id,
      element_html_id: element?.element_html_id ?? null,
      project_id,
      // _user,
      parent_id: element?.parent_id ?? null,
      content: element?.content ?? null,
      element_type: element?.element_type ?? null,
      // element_disable_delete: element?._disableDelete ?? null,
      element_page: element?.element_page ?? null,
      viewport: element?.viewport ?? null,
      template_id: element?.template_id ?? null,
      component_id: element?.component_id ?? null,
      ref_component_id: element?.ref_component_id ?? null,
    }
  })
  return elementsOut
}
