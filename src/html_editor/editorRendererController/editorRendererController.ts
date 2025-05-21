import { useMemo, useState } from 'react'
import { defaultEditorState } from './defaultEditorState'
import { useAppController } from './appController'
import { useShortcuts } from './useShortcuts'
import { EditorStateType } from '../types'
import { ElementModel } from '../editorComponents'
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
    | 'ui'
  >
  injections?: {
    elementModels?: ElementModel[]
  }
}

export const useEditorRendererController = (
  params?: EditorRendererControllerParams
): EditorRendererControllerType => {
  // load initial state if provided
  const { initialEditorState, injections } = params ?? {}
  const initDefaultState = defaultEditorState()
  const initialEditorStateAdj: EditorStateType = {
    ...initDefaultState,
    ...(initialEditorState ?? {}),
    ui: {
      ...initDefaultState.ui,
      ...(initialEditorState?.ui ?? {}),
      navigationMenu: {
        ...initDefaultState.ui.navigationMenu,
        ...(initialEditorState?.ui.navigationMenu ?? {}),
      },
      detailsMenu: {
        ...initDefaultState.ui.detailsMenu,
        ...(initialEditorState?.ui.detailsMenu ?? {}),
      },
    },
  }

  const [editorState, setEditorState] = useState(initialEditorStateAdj)

  const {
    currentViewportElements,
    selectedElement,
    selectedPageElements,
    ELEMENT_MODELS,
    allElements,
  } = useShortcuts({ editorState, customComponents: injections?.elementModels })

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
      ELEMENT_MODELS: ELEMENT_MODELS as ElementModel[],
      allElements,
    }
  }, [
    selectedElement,
    selectedPageElements,
    currentViewportElements,
    editorState,
    appController,
    setEditorState,
    ELEMENT_MODELS,
    allElements,
  ])
  return rendererController
}
