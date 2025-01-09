import { useMemo, useState } from 'react'
import { defaultEditorState } from './defaultEditorState'
import { useAppController } from './appController'
import { useShortcuts } from './useShortcuts'
import { EditorStateType } from '../types'
import { replacePlaceholdersInString } from '../renderer'
import { ComponentDefType } from '../editorComponents'

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
    attributes: editorState.attributes,
  })

  // needs appcontroller for placeholders
  const selectedElementAttributesResolved = useMemo(() => {
    const elementAttributes = editorState.attributes.filter(
      (attr) => attr.element_id === editorState.ui.selected.element
    )
    const elementAttributesDict =
      elementAttributes.reduce<Record<string, string>>((acc, attr) => {
        const key = attr.attr_name
        if (key === 'style') {
          return acc
        }
        const valueRaw = attr.attr_value as string
        const regex = /{(.*?)}/
        const value =
          typeof valueRaw === 'string' && valueRaw.match(regex)
            ? replacePlaceholdersInString(
                valueRaw,
                appController.state,
                editorState.composite_component_props,
                editorState.properties,
                editorState.attributes,
                selectedElement,
                selectedElement?.element_id ?? null,
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
    editorState.composite_component_props,
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
