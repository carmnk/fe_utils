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
  })

  const actions = useMemo(() => {
    // key is the element id
    const updateProperty = (key: string, value: any) => {
      setAppState((current) => ({ ...current, [key]: value }))
    }
    const removeProperty = (key: string) => {
      setAppState((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = current
        return rest as any
      })
    }
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

    const getFormData = (elementId: string) => {
      return appState.forms?.[elementId] ?? {}
    }

    const updateData = (key: string, value: any) => {
      console.log('updateData', key, value)
      setAppState((current) => {
        return {
          ...current,
          _data: { ...current._data, [key]: value },
        }
      })
    }
    const removeData = (key: string) => {
      setAppState((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = current
        return rest as any
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
