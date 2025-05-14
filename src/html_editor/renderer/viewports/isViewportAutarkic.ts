import { EditorStateType, Element } from '../../editorRendererController'

export const isViewportAutarkic = (
  currentViewportElements: Element[],
  viewport: EditorStateType['ui']['selected']['viewport']
) =>
  !!currentViewportElements.find(
    (el) => !el.parent_id && !el.component_id && el.viewport === viewport
  )
