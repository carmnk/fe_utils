import { useEffect, useMemo, useState } from 'react'
import { AppState, EditorStateType } from './types'
import { AppController } from './types'
import { replacePlaceholdersInString } from '../renderer'
import { EditorRendererControllerType } from './types/editorRendererController'

export type EditorControllerAppStateParams = {
  // editorState: EditorStateType
  // setEditorState: Dispatch<SetStateAction<EditorStateType>>
  properties: EditorStateType['properties']
  attributes: EditorStateType['attributes']
  transformers: EditorStateType['transformers']
  currentViewportElements: EditorRendererControllerType['currentViewportElements']
}

export const useAppController = (
  params: EditorControllerAppStateParams
): AppController => {
  const { properties, attributes, currentViewportElements, transformers } =
    params

  const [appState, setAppState] = useState<AppState>({
    forms: {},
    _data: {},
    treeviews: {
      selectedId: {},
      selectedItem: {},
    },
    buttonStates: {},
    navigationStates: {},
  })

  const actions = useMemo(() => {
    /** update/add navstates - TODO still flat in appstate
     * @param key - key = elementId of navElement
     * @param value - value = value of navElement
     * */
    const updateProperty = (key: string, value: unknown) => {
      setAppState((current) => ({ ...current, [key]: value }))
    }

    /** remove navstates - TODO still flat in appstate
     * @param key - key = elementId of navElement
     * */
    const removeProperty = (key: string) => {
      setAppState((current) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = current
        return rest as typeof appState
      })
    }

    /** change/add formData for specifc form-element with elementId
     * @param elementId - elementId of form-element
     * @param newFormData - newFormData = new formdata for form-element
     * */
    const changeFormData = (
      elementId: string,
      newFormData: Record<string, unknown>
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
    const updateData = (key: string, value: { [key: string]: unknown }) => {
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
        return rest as typeof appState
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
      selectedItem: Record<string, unknown>
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
              ...((current.treeviews.selectedId ??
                {}) as (typeof appState)['treeviews']['selectedId']),
              [treeViewElementId]: [selectedId],
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
      if (!treeviewItemsPropertyValue || !treeViewElement) return

      const treeviewItemsPropertyValueResolved0 = replacePlaceholdersInString(
        treeviewItemsPropertyValue as string,
        appState,
        [],
        properties,
        attributes,
        treeViewElement,
        treeViewElementId,
        undefined,
        undefined,
        undefined, // icons
        undefined,
        undefined
      )
      const transformer = transformers.find(
        (trans) => trans.element_id === treeViewElementId
      )
      const transformerFunction = transformer?.transformer_string
        ? eval(transformer?.transformer_string)
        : null
      // need to transform if transformer is present to get the name of the id column -> nodeId
      const treeviewItemsPropertyValueResolved = transformerFunction
        ? transformerFunction(treeviewItemsPropertyValueResolved0)
        : treeviewItemsPropertyValueResolved0

      const id = itemId?.[0] ?? itemId?.[0]?.[0]
      const item = treeviewItemsPropertyValueResolved?.find?.(
        (item: unknown) =>
          item &&
          typeof item === 'object' &&
          'nodeId' in item &&
          item.nodeId === id
      )
      if (!item) return
      actions.changeTreeviewSelectedItem(treeViewElementId, id, item)
    }

    const treeviewElementIds = Object.keys(appState.treeviews.selectedId)
    treeviewElementIds.forEach((elementId) => {
      const selectedId = appState.treeviews.selectedId[elementId]
      if (selectedId) {
        // TODO: check if this is correct -> selectedId as any
        onTreeViewSelectionChange(elementId, selectedId as unknown as string)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState?._data])

  const controller = useMemo(() => {
    return {
      state: appState,
      actions,
    }
  }, [appState, actions])

  return controller
}
