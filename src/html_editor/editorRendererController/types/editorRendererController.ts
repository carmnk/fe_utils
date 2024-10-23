import { CSSProperties, Dispatch, SetStateAction } from 'react'
import { AppController, EditorStateType, Element } from '.'

export type EditorRendererControllerType<
  ControllreActionsType extends { [key: string]: any },
> = {
  editorState: EditorStateType
  appController: AppController
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  getRecursiveChildren: (elements: Element[], parentId: string) => Element[]
  getSelectedImage: (imageId?: string) => {
    image: typeof Image
    fileName: string
    src: string
    imageSrcId: string
  } | null
  //
  selectedElement: Element | null
  selectedPageElements: Element[]
  selectedElementStyleAttributes: CSSProperties
  getStyleAttributesDictByElementId: (elementId: string) => Record<string, any>
  currentViewportElements: Element[]
  COMPONENT_MODELS: any[]
  actions?: ControllreActionsType
  selectedElementAttributes: Record<string, string>
  selectedElementAttributesResolved: Record<string, unknown>

  // actions: ReturnType<typeof useEditorActions>
}
