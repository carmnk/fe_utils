import { useEffect, useMemo, useState } from 'react'
import { AppState, EditorStateType } from './types'
import { AppController } from './types'
import { replacePlaceholdersInString } from '../renderer'
import { EditorRendererControllerType } from './types/editorRendererController'

export type EditorControllerAppStateParams = {
  // editorState: EditorStateType
  // setEditorState: Dispatch<SetStateAction<EditorStateType>>
  properties: EditorStateType['properties']
  currentViewportElements: EditorRendererControllerType<any>['currentViewportElements']
}

export const useAppController = (
  params: EditorControllerAppStateParams
): AppController => {
  const { properties, currentViewportElements } = params
  const [appState, setAppState] = useState<AppState>({
    forms: {},
    _data: {},
    treeviews: {
      selectedId: {},
      selectedItem: {},
    },
    buttonStates: {},
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

    const changeButtonState = (buttonElementId: string) => {
      setAppState((current) => {
        return {
          ...current,
          buttonStates: {
            ...current.buttonStates,
            [buttonElementId]: !current?.buttonStates?.[buttonElementId],
          },
        }
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
      changeButtonState,
    }
  }, [setAppState, appState?.forms])

  useEffect(() => {
    const onTreeViewSelectionChange = (
      treeViewElementId: string,
      itemId: string
    ) => {
      const treeviewItemsPropertyValue = properties?.find?.(
        (prop) =>
          prop.element_id === treeViewElementId &&
          prop.prop_name === 'items' &&
          typeof prop.prop_value === 'string' &&
          prop.prop_value.includes('{_data.')
      )?.prop_value

      const treeViewElement = currentViewportElements?.find?.(
        (element) => element._id === treeViewElementId
      )
      console.log(
        'treeviewItemsPropertyValue 0',
        treeViewElement,
        treeviewItemsPropertyValue
      )
      if (!treeviewItemsPropertyValue || !treeViewElement) return

      const treeviewItemsPropertyValueResolved = replacePlaceholdersInString(
        treeviewItemsPropertyValue,
        appState,
        [],
        properties,
        treeViewElement,
        undefined,
        undefined,
        undefined, // icons
        undefined,
        undefined
      )

      const item = treeviewItemsPropertyValueResolved?.find?.(
        (item: any) => item.product_id === itemId?.[0]?.[0]
      )
      console.log(
        'treeviewItemsPropertyValue',
        treeviewItemsPropertyValue,
        treeviewItemsPropertyValueResolved,
        itemId?.[0],
        item
      )
      if (!item) return
      console.log('treeviewItemsPropertyValue item', item)
      actions.changeTreeviewSelectedItem(treeViewElementId, itemId, item)
    }

    const treeviewElementIds = Object.keys(appState.treeviews.selectedId)
    treeviewElementIds.forEach((elementId) => {
      const selectedId = appState.treeviews.selectedId[elementId]
      if (selectedId) {
        onTreeViewSelectionChange(elementId, selectedId)
      }
    })
  }, [appState?._data])

  const controller = useMemo(() => {
    return {
      state: appState,
      actions,
    }
  }, [appState, actions])

  return controller
}
