export type AppState = {
  [key: string]: any
  forms: { [key: string]: Record<string, any> }
  _data: { [key: string]: any }
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
  }
}
