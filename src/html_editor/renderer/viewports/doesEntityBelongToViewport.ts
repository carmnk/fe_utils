import {
  Attribute,
  EditorStateType,
  Element,
  Property,
} from '../../editorRendererController'
import { getAdaptiveReferenceViewports } from './getAdaptiveReferfenceViewports'

/** Entity = Element, Property or Attribute */
export const doesEntityBelongToViewport = (
  entity_id: string,
  viewport: string | undefined | null,
  isViewportAutarkic: boolean | undefined,
  viewport_references: EditorStateType['viewport_references'],
  entityViewport: string | null,
  entities: (Property | Attribute | Element)[]
) => {
  return (
    ((!viewport || viewport === 'xs') &&
      (!entityViewport || entityViewport === 'xs')) ||
    (viewport && viewport !== 'xs'
      ? isViewportAutarkic
        ? entityViewport === viewport
        : (() => {
            // are sorted by priority
            const adaptiveReferenceViewports = getAdaptiveReferenceViewports(
              viewport,
              viewport_references
            )
            const entity0 = entities.find((ent) =>
              'prop_id' in ent
                ? ent.prop_id === entity_id
                : 'attr_id' in ent
                  ? ent.attr_id === entity_id
                  : ent.element_id === entity_id
            )
            const entitysAcrossViewports = entities.filter((entity) =>
              'prop_id' in entity || 'attr_id' in entity
                ? entity.element_id === entity0?.element_id
                : entity.parent_id === (entity0 as Element)?.parent_id
            )

            const viewportRefsWithHigherPriority =
              adaptiveReferenceViewports.slice(
                0,
                adaptiveReferenceViewports.findIndex(
                  (ref) => ref === entityViewport
                )
              )
            const doesEntityWithHigherViewportRefPriorityExist =
              entitysAcrossViewports.find((ent) =>
                viewportRefsWithHigherPriority.includes(ent?.viewport ?? 'xs')
              )

            // if (
            //   'prop_id' in (entities?.[0] ?? {}) &&
            //   (
            //     entities.find(
            //       (ent) => (ent as any)?.prop_id === entity_id
            //     ) as any
            //   )?.prop_name === 'children'
            // )
              // console.log(
              //   'doesEntityBelongToViewport --> ADAPTIVE END',
              //   viewport,
              //   entityViewport,
              //   adaptiveReferenceViewports,
              //   entitysAcrossViewports,
              //   "higher Pro",
              //   viewportRefsWithHigherPriority,
              //   doesEntityWithHigherViewportRefPriorityExist
              // )

              return doesEntityWithHigherViewportRefPriorityExist
                ? false
                : entityViewport
                  ? adaptiveReferenceViewports.includes(entityViewport)
                  : adaptiveReferenceViewports.includes('xs')
          })()
      : false)
  )
}
