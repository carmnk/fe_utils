import { FC, MouseEvent } from 'react'
import { ComponentDefType } from '../editorComponents'
import {
  AppController,
  EditorStateType,
  Element,
  Property,
} from '../editorRendererController'
import { createAppAction } from './actions/createAppAction'
import { NavigateFunction } from 'react-router-dom'

export type GetReactElementPropsParams = {
  element: Element
  elementPropsObject: Record<string, unknown>
  elementProps: Property[]
  appController: AppController
  CurrentComponent?: FC<object>
  tableUis: EditorStateType['ui']['tableUis']
  uiActions: unknown
  icons: Record<string, string>
  eventHandlerProps: Record<string, unknown>
  editorState: EditorStateType
  currentViewportElements: Element[]
  COMPONENT_MODELS: ComponentDefType[]
  isProduction?: boolean
  navigate: NavigateFunction
}
export const getReactElementProps = (params: GetReactElementPropsParams) => {
  const {
    element,
    elementProps,
    elementPropsObject,
    appController,
    CurrentComponent,
    tableUis,
    uiActions,
    icons,
    eventHandlerProps,
    editorState,
    currentViewportElements,
    COMPONENT_MODELS,
    isProduction,
    navigate,
  } = params

  const getPropByName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.prop_value

  const navValueState = appController?.state?.[element?._id] ?? []
  const onTabChange = (tabValue: string) => {
    appController.actions.updateProperty(element?._id, tabValue)
  }

  const openModal = appController?.state?.[element?._id]
  const handleToggleOpen = (open: boolean) => {
    appController.actions.updateProperty(element?._id, !open)
  }

  const reactiveElementProps =
    element?._type?.toLowerCase().includes('treeview') && CurrentComponent
      ? (() => {
          const treeViewSelectedState =
            appController?.state?.treeviews?.selectedId[element?._id] ?? {}
          const onTreeViewSelectionChange = (e: unknown, itemId: string) => {
            const item = Array.isArray(elementPropsObject?.items)
              ? elementPropsObject?.items?.find(
                  (item) => item.nodeId === itemId
                )
              : []
            appController.actions.changeTreeviewSelectedItem(
              element?._id,
              itemId,
              item
            )
          }

          return {
            selectedItems: treeViewSelectedState,
            onNodeSelect: onTreeViewSelectionChange,
          }
        })()
      : ['Table'].includes(element?._type) && CurrentComponent
        ? (() => {
            const clientFilters = tableUis?.[element._id]?.filters ?? []
            const clientFiltersExSorting = clientFilters?.filter(
              (f) => f.filterKey !== 'sorting'
            )
            const clientFilterSorting = clientFilters?.filter(
              (f) => f.filterKey === 'sorting'
            )?.[0]?.value
            const [clientFilterKey, clientFilterDirection] =
              clientFilterSorting?.split?.(',') ?? []

            const dataProp = getPropByName('data')
            const isPlaceholderProp = typeof dataProp === 'string'
            const tableData =
              ((isPlaceholderProp
                ? elementPropsObject?.data
                : dataProp) as Record<string, string>[]) || []
            const clientFilteredTableData =
              tableData?.filter?.((d) =>
                clientFiltersExSorting?.length
                  ? clientFilters.some((f) => f.value === d[f.filterKey])
                  : true
              ) ?? []
            const clientSortedFilteredTableData = clientFilterKey
              ? clientFilteredTableData?.sort?.((a, b) => {
                  const sortKey = clientFilterKey
                  return a?.[sortKey] > b?.[sortKey]
                    ? clientFilterDirection === 'asc'
                      ? 1
                      : -1
                    : b?.[sortKey] > a?.[sortKey]
                      ? clientFilterDirection === 'asc'
                        ? -1
                        : 1
                      : 0
                })
              : clientFilteredTableData
            return {
              data: clientSortedFilteredTableData || [],
              onSetFilters: (
                newFilters: { filterKey: string; value: string }[]
              ) => {
                if (
                  uiActions &&
                  typeof uiActions === 'object' &&
                  'setTableFilters' in uiActions
                ) {
                  typeof uiActions?.setTableFilters === 'function' &&
                    uiActions?.setTableFilters?.(element._id, newFilters)
                }
              },
              filters: clientFilters,
            }
          })()
        : ['Form'].includes(element?._type) && CurrentComponent
          ? (() => {
              return {
                formData:
                  elementPropsObject?.formData ??
                  appController.actions.getFormData(element._id),
                onChangeFormData: eventHandlerProps?.onChangeFormData
                  ? (newFormData: Record<string, unknown>) =>
                      createAppAction?.({
                        element,
                        eventName: 'onChangeFormData',
                        editorState,
                        currentViewportElements,
                        COMPONENT_MODELS,
                        appController,
                        icons,
                        navigate,
                        isProduction,
                      })?.(null, newFormData)
                  : (
                      newFormData: Record<string, unknown>
                      // propertyKey: string,
                      // propertyValue: any,
                      // prevFormData: any
                    ) => {
                      appController.actions.changeFormData(
                        element._id,
                        newFormData
                      )
                    },
              }
            })()
          : element._type === 'Button'
            ? {
                onClick: (e: MouseEvent) => {
                  if (element?._type === 'Button') {
                    appController.actions.changeButtonState(element._id)
                  }
                  if (
                    eventHandlerProps?.onClick &&
                    typeof eventHandlerProps?.onClick === 'function'
                  ) {
                    eventHandlerProps.onClick(e)
                  }
                },
              }
            : [
                  'Tabs',
                  'BottomNavigation',
                  'ListNavigation',
                  'ButtonGroup',
                ].includes(element._type)
              ? {
                  onChange: onTabChange,
                  value: navValueState,
                }
              : element._type === 'Dialog'
                ? {
                    open: openModal,
                    onClose: handleToggleOpen,
                    ...(!isProduction && { disablePortal: true }),
                  }
                : element._type === 'AppBar'
                  ? {
                      sx:
                        (elementPropsObject?.position === 'fixed' ||
                          !elementPropsObject?.position) &&
                        !isProduction
                          ? {
                              ...(elementPropsObject?.sx ?? {}),
                              top: 42,
                              left: editorState.ui.previewMode ? 0 : 364,
                              width: editorState.ui.previewMode
                                ? '100%'
                                : 'calc(100% - 364px - 350px)',
                            }
                          : { ...(elementPropsObject?.sx ?? {}) },
                    }
                  : {}
  return reactiveElementProps
}
