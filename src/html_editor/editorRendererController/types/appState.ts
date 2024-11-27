import { useAppController } from '../appController'

export type AppState = {
  [key: string]: unknown
} & {
  navigationStates: { [key: string]: string | boolean }
  forms: { [key: string]: Record<string, unknown> }
  _data: { [key: string]: Record<string, unknown> }
  treeviews: {
    selectedId: {
      [elementId: string]: string[]
    }
    selectedItem: {
      [elementId: string]: Record<string, unknown>
    }
  }
  buttonStates: { [key: string]: boolean }
  // tables: { [key: string]: Record<string, any> }
}

export type AppActions = ReturnType<typeof useAppController>['actions']

export type AppController = {
  state: AppState
  actions: {
    addProperty: (key: string, value: unknown) => void
    removeProperty: (key: string) => void
    updateProperty: (key: string, value: unknown) => void
    changeFormData: (
      elementId: string,
      newFormData: Record<string, unknown>
    ) => void
    getFormData: (elementId: string) => Record<string, unknown>
    updateData: (key: string, value: { [key: string]: unknown }) => void
    removeData: (key: string) => void
    changeTreeviewSelectedItem: (
      treeViewElementId: string,
      selectedId: string,
      selectedItem: Record<string, unknown>
    ) => void
    changeButtonState: (buttonElementId: string) => void
  }
}
