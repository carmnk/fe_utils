import { uniq } from 'lodash'
import { EditorStateType } from '../../editorRendererController'

export const getAdaptiveReferenceViewports = (
  vp: string | undefined | null,
  viewport_references: EditorStateType['viewport_references'],
  vps?: string[]
): string[] => {

  const viewportReference = viewport_references.find(
    (ref) => ref.adaptive_viewport_name === vp
  )
  if (!viewportReference || viewportReference?.reference_viewport === 'xs') {
    const vpArr = vp ? [vp] : []
    const newRefViewports = [...(vps ?? []), ...vpArr, 'xs']
    return uniq(newRefViewports)
  } else {
    const refVp = viewportReference.reference_viewport
    if (vps?.includes?.(refVp ?? 'xs')) return vps
    const newVps = [...(vps ?? []), refVp]
    const refVpReferences = getAdaptiveReferenceViewports(
      refVp,
      viewport_references,
      newVps
    )
    const newRefViewports = uniq([
      vp ?? 'xs',
      refVp,
      ...(refVpReferences ?? []),
    ])
    return newRefViewports
  }
}
