export type AppState = {
  [key: string]: any
  forms: { [key: string]: Record<string, any> }
  _data: { [key: string]: any }
  treeviews: {
    selectedId: {
      [elementId: string]: string
    }
    selectedItem: {
      [elementId: string]: any
    }
  }
  buttonStates: { [key: string]: boolean }
  // tables: { [key: string]: Record<string, any> }
}

export type AppController = {
  state: AppState
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
    changeTreeviewSelectedItem: (
      treeViewElementId: string,
      selectedId: string,
      selectedItem: any
    ) => void
    changeButtonState: (buttonElementId: string) => void
  }
}
