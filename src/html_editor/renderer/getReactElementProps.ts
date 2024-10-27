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
  CurrentComponent: any
  tableUis: any
  uiActions: any
  icons: any
  eventHandlerProps: any
  editorState: EditorStateType
  currentViewportElements: Element[]
  COMPONENT_MODELS: any
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

  const navValueState = (appController as any)?.state?.[element?._id] ?? []
  const onTabChange = (tabValue: string) => {
    appController.actions.updateProperty(element?._id, tabValue)
  }

  const openModal = (appController as any)?.state?.[element?._id]
  const handleToggleOpen = () => {
    appController.actions.updateProperty(element?._id, !open)
  }

  const reactiveElementProps =
    element?._type?.toLowerCase().includes('treeview') && CurrentComponent
      ? (() => {
          const treeViewSelectedState =
            appController?.state?.treeviews?.selectedId[element?._id] ?? {}
          const onTreeViewSelectionChange = (e: any, itemId: string) => {
            const item = Array.isArray(elementPropsObject?.items)
              ? elementPropsObject?.items?.find(
                  (item: any) => item.nodeId === itemId
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
              (f: any) => f.filterKey !== 'sorting'
            )
            const clientFilterSorting = clientFilters?.filter(
              (f: any) => f.filterKey === 'sorting'
            )?.[0]?.value
            const [clientFilterKey, clientFilterDirection] =
              clientFilterSorting?.split?.(',') ?? []

            const dataProp = getPropByName('data')
            const isPlaceholderProp = typeof dataProp === 'string'
            const tableData =
              (isPlaceholderProp ? elementPropsObject?.data : dataProp) || []
            const clientFilteredTableData =
              tableData?.filter?.((d: any) =>
                clientFiltersExSorting?.length
                  ? clientFilters.some((f: any) => f.value === d[f.filterKey])
                  : true
              ) ?? []
            const clientSortedFilteredTableData = clientFilterKey
              ? clientFilteredTableData?.sort?.((a: any, b: any) => {
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
              onSetFilters: (newFilters: any) => {
                typeof uiActions?.setTableFilters === 'function' &&
                  uiActions?.setTableFilters?.(element._id, newFilters)
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
                  ? (newFormData: any) =>
                      createAppAction?.({
                        element,
                        eventName: 'onChangeFormData',
                        editorState,
                        currentViewportElements,
                        COMPONENT_MODELS,
                        appController,
                        icons,
                        navigate,
                        isDev: !isProduction,
                      })?.(null, newFormData)
                  : /* eslint-disable @typescript-eslint/no-unused-vars */
                    (
                      newFormData: any,
                      propertyKey: string,
                      propertyValue: any,
                      prevFormData: any
                      /* eslint-enable @typescript-eslint/no-explicit-any */
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
                onClick: (e: any) => {
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
                        ((elementPropsObject as any)?.position === 'fixed' ||
                          !(elementPropsObject as any)?.position) &&
                        !isProduction
                          ? {
                              ...((elementPropsObject as any)?.sx ?? {}),
                              top: 42,
                              left: editorState.ui.previewMode ? 0 : 364,
                              width: editorState.ui.previewMode
                                ? '100%'
                                : 'calc(100% - 364px - 350px)',
                            }
                          : { ...((elementPropsObject as any)?.sx ?? {}) },
                    }
                  : {}
  return reactiveElementProps
}
