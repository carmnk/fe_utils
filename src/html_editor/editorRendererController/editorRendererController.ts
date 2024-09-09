import { useState, useEffect } from 'react'
import { EditorStateType, defaultEditorState } from './editorState'
import { useAppController } from './appController'
import { useShortcuts } from './useShortcuts'

export const useEditorRendererController = (params?: {
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
    // hooks?: {
    //   onAppMounted?: () => void
    //   onAppUnmounted?: () => void
    //   onNavigate?: (currentPath: string, newPath: string) => void
    // }
  }
}) => {
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

  // initialize default props for elements/components
  useEffect(() => {
    if (!initialEditorState?.elements?.length || !editorState?.elements?.length)
      return // no initial elements
    editorState?.elements?.forEach((el) => {
      const defaultComponentProps = COMPONENT_MODELS.find(
        (comp) => comp.type === el._type
      )
      if (!defaultComponentProps) return
      if ('state' in defaultComponentProps) {
        const _id = el._id
        appController.actions.addProperty(
          _id,
          (defaultComponentProps as any)?.state ?? ''
        )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only run once

  const appController = useAppController()

  // const actions = useEditorActions({
  //   editorState,
  //   setEditorState,
  //   selectedElement,
  //   selectedElementStyleAttributes,
  //   selectedPageElements,
  //   currentViewportElements,
  //   appController,
  //   components: COMPONENT_MODELS,
  //   COMPONENT_MODELS,
  //   getRecursiveChildren,
  //   getStyleAttributesDictByElementId,
  // })

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
    // actions,
    getRecursiveChildren,
    getStyleAttributesDictByElementId,
  }
}
