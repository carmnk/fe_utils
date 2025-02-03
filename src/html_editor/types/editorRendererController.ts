import { Dispatch, SetStateAction } from 'react'
import { AppController, EditorStateType, Element } from '.'
import { ComponentDefType } from '../editorComponents'

export type EditorRendererControllerType = {
  editorState: EditorStateType
  appController: AppController
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
  selectedElement: Element | null
  selectedPageElements: Element[]
  currentViewportElements: Element[]
  ELEMENT_MODELS: ComponentDefType[]
}
