import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { AppState, EditorStateType } from './types'
import { AppController } from './types'

export type EditorControllerAppStateParams = {
  editorState: EditorStateType
  setEditorState: Dispatch<SetStateAction<EditorStateType>>
}

export const useAppController = (): AppController => {
  const [appState, setAppState] = useState<AppState>({
    forms: {},
    _data: {},
    treeviews: {
      selectedId: {},
      selectedItem: {},
    },
  })

  const actions = useMemo(() => {
    /** update/add navstates - TODO still flat in appstate
     * @param key - key = elementId of navElement
     * @param value - value = value of navElement
     * */
    const updateProperty = (key: string, value: any) => {
      console.log('updateProperty inner', key, value)
      setAppState((current) => ({ ...current, [key]: value }))
    }

    /** remove navstates - TODO still flat in appstate
     * @param key - key = elementId of navElement
     * */
    const removeProperty = (key: string) => {
      setAppState((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = current
        return rest as any
      })
    }

    /** change/add formData for specifc form-element with elementId
     * @param elementId - elementId of form-element
     * @param newFormData - newFormData = new formdata for form-element
     * */
    const changeFormData = (
      elementId: string,
      newFormData: Record<string, any>
    ) => {
      setAppState((current) => {
        // const formData = current.forms?.[elementId] ?? {}
        // const newFormData = { ...formData, [inputName]: value }
        return {
          ...current,
          forms: { ...current.forms, [elementId]: newFormData },
        }
      })
    }

    /** get formData for specific form-element with element
     * @param elementId - elementId of form-element
     *  */
    const getFormData = (elementId: string) => {
      return appState.forms?.[elementId] ?? {}
    }

    /** update/add data from API/EPs
     * @param key - key = currently actionId TODO
     * @param value - value = querried data (axios response)
     */
    const updateData = (key: string, value: any) => {
      console.log('updateData', key, value)
      setAppState((current) => {
        return {
          ...current,
          _data: { ...current._data, [key]: value },
        }
      })
    }

    /** remove data from API/EPs (is this function used?)
     * @param key - key = see above
     */
    const removeData = (key: string) => {
      setAppState((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = current
        return rest as any
      })
    }

    const changeTreeviewSelectedItem = (
      treeViewElementId: string,
      selectedId: string,
      selectedItem: any
    ) => {
      setAppState((current) => {
        return {
          ...current,
          treeviews: {
            ...current.treeviews,
            selectedItem: {
              ...(current.treeviews.selectedItem ?? {}),
              [treeViewElementId]: selectedItem,
            },
            selectedId: {
              ...(current.treeviews.selectedId ?? {}),
              [treeViewElementId]: [selectedId] as any,
            },
          },
        }
      })
    }

    return {
      getFormData,
      changeFormData,
      addProperty: updateProperty,
      removeProperty,
      updateProperty,
      updateData,
      removeData,
      changeTreeviewSelectedItem,
    }
  }, [setAppState, appState?.forms])

  const controller = useMemo(() => {
    return {
      state: appState,
      actions,
    }
  }, [appState, actions])

  return controller
}
