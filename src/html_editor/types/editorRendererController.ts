import { CSSProperties, Dispatch, SetStateAction } from 'react'
import { AppController, EditorStateType, Element } from '.'
import { ComponentDefType } from '../editorComponents'

export type EditorRendererControllerType =
  // <
  //   ControllreActionsType extends { [key: string]: unknown },
  // >
  {
    editorState: EditorStateType
    appController: AppController
    setEditorState: Dispatch<SetStateAction<EditorStateType>>
    getRecursiveChildren: (elements: Element[], parentId: string) => Element[]
    getSelectedImage: (imageId?: string) => {
      image: typeof Image
      asset_filename: string
      src: string
      imageSrcId: string
    } | null
    //
    selectedElement: Element | null
    selectedPageElements: Element[]
    selectedElementStyleAttributes: CSSProperties
    getStyleAttributesDictByElementId: (
      elementId: string
    ) => Record<string, unknown>
    currentViewportElements: Element[]
    ELEMENT_MODELS: ComponentDefType[]
    // actions?: ControllreActionsType
    selectedElementAttributes: Record<string, string>
    selectedElementAttributesResolved: Record<string, unknown>

    // actions: ReturnType<typeof useEditorActions>
  }
