import { useMemo, useState } from 'react'
import { defaultEditorState } from './defaultEditorState'
import { useAppController } from './appController'
import { useShortcuts } from './useShortcuts'
import { EditorStateType } from './types'

export type EditorRendererControllerParams = {
  initialEditorState?: Pick<
    EditorStateType,
    | 'assets'
    | 'cssSelectors'
    | 'defaultTheme'
    | 'elements'
    | 'fonts'
    | 'project'
    | 'themes'
  >
  injections?: {
    components?: any[]
    actions?: any[]
  }
}

export const useEditorRendererController = (
  params?: EditorRendererControllerParams
) => {
  // load initial state if provided
  const { initialEditorState, injections } = params ?? {}
  const initialEditorStateAdj = {
    ...defaultEditorState(),
    ...(initialEditorState ?? {}),
  }
  const [editorState, setEditorState] = useState(initialEditorStateAdj)

  const {
    currentViewportElements,
    selectedElement,
    selectedElementStyleAttributes,
    getStyleAttributesDictByElementId,
    selectedPageElements,
    getSelectedImage,
    COMPONENT_MODELS,
    getRecursiveChildren,
  } = useShortcuts({ editorState, customComponents: injections?.components })

  const appController = useAppController()

  const rendererController = useMemo(() => {
    return {
      selectedElement,
      selectedPageElements,
      selectedElementStyleAttributes,
      currentViewportElements,
      COMPONENT_MODELS,
      editorState,
      appController,
      setEditorState,
      getSelectedImage,
      getRecursiveChildren,
      getStyleAttributesDictByElementId,
    }
  }, [
    selectedElement,
    selectedPageElements,
    selectedElementStyleAttributes,
    currentViewportElements,
    COMPONENT_MODELS,
    editorState,
    appController,
    setEditorState,
    getSelectedImage,
    getRecursiveChildren,
    getStyleAttributesDictByElementId,
  ])
  return rendererController
}
