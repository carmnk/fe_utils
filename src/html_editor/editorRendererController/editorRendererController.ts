import { useMemo, useState } from 'react'
import { defaultEditorState } from './defaultEditorState'
import { useAppController } from './appController'
import { useShortcuts } from './useShortcuts'
import { EditorStateType } from '../types'
import { ComponentDefType } from '../editorComponents'
import { EditorRendererControllerType } from '../types/editorRendererController'

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
    components?: ComponentDefType[]
  }
}

export const useEditorRendererController = (
  params?: EditorRendererControllerParams
): EditorRendererControllerType => {
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
    selectedPageElements,
    ELEMENT_MODELS,
  } = useShortcuts({ editorState, customComponents: injections?.components })

  const appController = useAppController({
    properties: editorState.properties,
    transformers: editorState.transformers,
    currentViewportElements,
    attributes: editorState.attributes,
  })

  const rendererController = useMemo(() => {
    return {
      selectedElement,
      selectedPageElements,
      currentViewportElements,
      editorState,
      appController,
      setEditorState,
      ELEMENT_MODELS: ELEMENT_MODELS as ComponentDefType[],
    }
  }, [
    selectedElement,
    selectedPageElements,
    currentViewportElements,
    editorState,
    appController,
    setEditorState,
    ELEMENT_MODELS,
  ])
  return rendererController
}
