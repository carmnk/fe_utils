import { EditorStateType, ElementType } from './editorState'

export type EditorRendererControllerType<
  ControllreActionsType extends { [key: string]: any },
> = {
  editorState: EditorStateType
  appController: EditorControllerAppStateReturnType
  setEditorState: React.Dispatch<React.SetStateAction<EditorStateType>>

  // getSelectedCssClass: (className?: string) => CSSProperties;
  getRecursiveChildren: (
    elements: ElementType[],
    parentId: string
  ) => ElementType[]
  getSelectedImage: (imageId?: string) => {
    image: typeof Image
    fileName: string
    src: string
    imageSrcId: string
  } | null
  //
  selectedElement: ElementType | null
  selectedPageElements: ElementType[]
  selectedElementStyleAttributes: React.CSSProperties
  getStyleAttributesDictByElementId: (elementId: string) => Record<string, any>
  currentViewportElements: ElementType[]
  COMPONENT_MODELS: any[]
  actions?: ControllreActionsType

  // actions: ReturnType<typeof useEditorActions>
}

export type EditorControllerAppStateType = {
  [key: string]: any
  forms: { [key: string]: Record<string, any> }
  _data: { [key: string]: any }
  // tables: { [key: string]: Record<string, any> }
}
export type EditorControllerAppStateReturnType = {
  state: EditorControllerAppStateType
  // values: { [key: string]: string[] };
  actions: {
    addProperty: (key: string, value: any) => void
    removeProperty: (key: string) => void
    updateProperty: (key: string, value: any) => void
    changeFormData: (
      elementId: string,
      newFormData: Record<string, any>
    ) => void
    getFormData: (elementId: string) => Record<string, any>
    updateData: (key: string, value: any) => void
    removeData: (key: string) => void
  }
  // setStateValues: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
}
