import { ENRICHED_ENTITY_JOININGS_MODEL_TYPE } from '../entityDataModel'
import { isEqual as isDeepEqual } from 'lodash'

/**
 * @returns all unique paths from base entity to all sub entities sequenced be pathlength descending
 */
export const getUniquePaths = <
  UseJoiningOutput extends
    ENRICHED_ENTITY_JOININGS_MODEL_TYPE = ENRICHED_ENTITY_JOININGS_MODEL_TYPE,
>(
  enrichedStructuredEntityJoinings: (ENRICHED_ENTITY_JOININGS_MODEL_TYPE & {
    path: string[]
  })[][],
  outputJoinings = false
): UseJoiningOutput[][] => {
  const allPaths: string[][] = []
  for (let l = enrichedStructuredEntityJoinings?.length - 1; l >= 0; l--) {
    for (let i = 0; i < enrichedStructuredEntityJoinings?.[l]?.length; i++) {
      const joining = enrichedStructuredEntityJoinings?.[l]?.[i]
      const path = [...(joining?.path ?? []), joining]
      // const linkedEntity = joining?.linked_entity
      // const linkedEntityName = linkedEntity?.entity_name
      allPaths.push(
        path?.map((joining) =>
          outputJoinings
            ? (joining as string)
            : ((joining as ENRICHED_ENTITY_JOININGS_MODEL_TYPE)?.linked_entity
                ?.entity_name as string)
        )
      )
    }
  }
  const sortedPaths = allPaths?.sort((a, b) => b?.length - a?.length)
  const preFilteredPaths = sortedPaths?.map((path, pIdx) => {
    const previousJoinings = sortedPaths?.slice(0, pIdx)
    const filteredPath = previousJoinings?.map((pathArr) =>
      isDeepEqual(pathArr.slice(0, path.length), path) ? null : path
    )
    const isDuplicate = !!filteredPath?.includes?.(null)
    const adjFilteredPath = !filteredPath?.length
      ? path
      : isDuplicate
        ? null
        : path
    return adjFilteredPath as string[]
  })
  // TODO: probably bug
  return preFilteredPaths?.filter?.((v) => v) as unknown as UseJoiningOutput[][]
}
