import { useMemo, useState } from 'react'
import { defaultEditorState } from './defaultEditorState'
import { useAppController } from './appController'
import { useShortcuts } from './useShortcuts'
import { EditorStateType } from './types'
import { replacePlaceholdersInString } from '../renderer'

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
    selectedElementAttributes,
  } = useShortcuts({ editorState, customComponents: injections?.components })

  const appController = useAppController({
    properties: editorState.properties,
    transformers: editorState.transformers,
    currentViewportElements,
  })

  // needs appcontroller for placeholders
  const selectedElementAttributesResolved = useMemo(() => {
    const elementAttributes = editorState.attributes.filter(
      (attr) => attr.element_id === editorState.ui.selected.element
    )
    const elementAttributesDict =
      elementAttributes.reduce<Record<string, any>>((acc, attr) => {
        const key = attr.attr_name
        if (key === 'style') {
          return acc
        }
        const valueRaw = attr.attr_value
        const regex = /{(.*?)}/
        const value = valueRaw.match(regex)
          ? replacePlaceholdersInString(
              valueRaw,
              appController.state,
              editorState.compositeComponentProps,
              editorState.properties,
              selectedElement,
              undefined,
              undefined,
              undefined // icons
            )
          : valueRaw
        const valueAdj = typeof value === 'string' ? value : value?.toString?.()
        return { ...acc, [key]: valueAdj }
      }, {}) ?? {}
    return elementAttributesDict
  }, [
    editorState.ui.selected.element,
    editorState.attributes,
    appController.state,
    editorState.compositeComponentProps,
    editorState.properties,
    selectedElement,
  ])

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
      selectedElementAttributes,
      selectedElementAttributesResolved,
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
    selectedElementAttributes,
    selectedElementAttributesResolved,
  ])
  return rendererController
}
