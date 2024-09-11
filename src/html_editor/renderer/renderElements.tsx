import {
  EditorStateType,
  ElementType,
} from '../editorRendererController/editorState'
import { ElementBox } from './ElementBox'
import { AppBar, Box, Paper, Theme } from '@mui/material'
import { EditorRendererControllerType } from '../editorRendererController/editorRendererControllerTypes'
import React from 'react'
import { PropertyType } from '../editorComponents/schemaTypes'
import { isComponentType } from './utils'
import { queryAction } from './queryAction'
import { replaceTemplateInString } from './templates'

export const isStringLowerCase = (str: string): boolean => {
  return str === str.toLowerCase()
}

export const renderElements = <
  ControllreActionsType extends { [key: string]: any },
>(params: {
  elements: ElementType[]
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType<ControllreActionsType>['appController']
  currentViewportElements: ElementType[]
  selectedPageElements: ElementType[]
  COMPONENT_MODELS: EditorRendererControllerType<ControllreActionsType>['COMPONENT_MODELS']
  selectedElement: ElementType | null
  actions?: ControllreActionsType
  //
  onSelectElement: (element: ElementType, isHovering: boolean) => void
  theme: Theme
  isProduction?: boolean
  icons?: { [key: string]: string }
  parentId?: string
  isPointerProduction?: boolean
  baseComponentId?: string
  disableOverlay?: boolean
  rootCompositeElementId?: string
  OverlayComponent?: React.FC<{
    element: ElementType
    isProduction?: boolean
    editorState: EditorStateType
    actions?: ControllreActionsType
  }>
  navigate: any
}): React.ReactNode => {
  const {
    elements,
    editorState,
    appController,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    selectedElement,
    actions,
    onSelectElement,
    theme,
    isProduction,
    icons,
    parentId,
    isPointerProduction,
    baseComponentId,
    disableOverlay,
    rootCompositeElementId,
    OverlayComponent,
    navigate,
  } = params

  const tableUis = editorState.ui.tableUis

  const elementsAdj = (
    !parentId
      ? elements?.filter((el) => !el._parentId)
      : elements?.filter((el) => el._parentId === parentId)
  )?.filter(
    (el) =>
      (baseComponentId && el.component_id === baseComponentId) ||
      (!baseComponentId && el._page === editorState.ui.selected.page)
  )

  const rawElements = elementsAdj.map((element) => {
    const rootElementOverlayProps = {
      element: element,
      isProduction,
      editorState,
      actions,
    }

    const typeFirstLetter = element._type.slice(0, 1)
    const isHtmlElement = isStringLowerCase(typeFirstLetter)
    const elementProps = editorState.properties?.filter(
      (prop) => prop.element_id === element._id
    )
    const templateProps = editorState.properties?.filter(
      (prop) =>
        prop.template_id === element.template_id &&
        !elementProps.find((elprop) => elprop.prop_name === prop.prop_name)
    )
    const allElementProps = [...(elementProps ?? []), ...(templateProps ?? [])]

    const getPropByName = (key: string) =>
      allElementProps?.find((prop) => prop.prop_name === key)?.prop_value

    const schemaProps = (element as any)?.schema?.properties ?? {}
    const elementIconKeys = isHtmlElement
      ? []
      : Object.keys(schemaProps)?.filter(
          (key) => schemaProps[key]?.type === PropertyType.icon
        )
    const elementArrayKeys = isHtmlElement
      ? []
      : Object.keys(schemaProps)?.filter((key) => {
          const itemsProps = (schemaProps?.[key] as any)?.items?.[0]?.properties
          return (
            schemaProps[key]?.type === PropertyType.Array &&
            Object.keys(itemsProps)?.filter?.(
              (key) => itemsProps[key]?.type === PropertyType.icon
            )
          )
        })
    const elementArrayIconInjectionDict = elementArrayKeys
      .map((key) => {
        const itemsProps = (schemaProps?.[key] as any)?.items?.[0]?.properties
        return Object.keys(itemsProps)
          ?.filter((key) => itemsProps[key]?.type === PropertyType.icon)
          ?.map((itemKey) => ({ key, itemKey }))
      })
      .flat()
      ?.reduce((acc, it) => {
        return {
          ...acc,
          [it.key]: getPropByName(it.key)?.map?.((item: any) => ({
            ...item,
            [it.itemKey]: icons?.[item[it.itemKey]],
          })),
        }
      }, {})

    // e.g. {...., icon: mdiPencil, ... }
    const injectedIconsDict = elementIconKeys?.reduce(
      (acc, key) => ({
        ...acc,
        [key]: icons?.[getPropByName(key)],
      }),
      {}
    )

    const baseComponent = COMPONENT_MODELS?.find(
      (com) => com.type === element?._type
    )
    const CurrentComponent =
      baseComponent &&
      'component' in baseComponent &&
      (baseComponent.component as React.ComponentType<any>)

    const elementPropsObject = allElementProps.reduce((acc, cur) => {
      const key = cur.prop_name
      const keyValue = getPropByName(key)
      // currently only data

      const matches = keyValue?.match?.(/{(_data|form|props)\.[^}]*}/g)
      const keyValueAdj = matches
        ? replaceTemplateInString(
            keyValue,
            appController.state,
            editorState.compositeComponentProps,
            editorState.properties,
            element as any,
            rootCompositeElementId
          )
        : keyValue
      return {
        ...acc,
        [key]: keyValueAdj,
      }
    }, {})

    const regex = /{(_data|form|props)\.[^}]*}/g
    const matches = element._content?.match?.(regex)
    const content = matches
      ? replaceTemplateInString(
          element._content ?? '',
          appController.state,
          editorState.compositeComponentProps,
          editorState.properties,
          selectedElement,
          rootCompositeElementId
        )
      : element._content
    const elementAdj = {
      ...element,
      content,
      props: {
        ...(elementPropsObject ?? {}),
        // ...iconInjection,
        // ...endIconInjection,
        ...injectedIconsDict,

        ...elementArrayIconInjectionDict,
      },
    }

    const navValueState = (appController as any)?.state?.[element?._id] ?? {}
    const onTabChange = (tabValue: string) => {
      appController.actions.updateProperty(element?._id, tabValue)
    }
    const elementChildren =
      (baseComponentId
        ? editorState.elements
        : currentViewportElements
      )?.filter((el) => el._parentId === element._id && element._id) ?? []
    const tabChildren =
      element?._type === ('NavContainer' as any)
        ? (() => {
            const sourceControlElementId = getPropByName('navigationElementId')
            // ?.navigationElementId

            if (!sourceControlElementId) return []
            const activeTab = appController?.state?.[sourceControlElementId]
            const activeId = getPropByName('items')?.find(
              (item: any) => item.value === activeTab
            )?.childId
            const activeChild = elementChildren?.find?.(
              (child) => child._id === activeId
            )
            const children = activeChild ? [activeChild] : []
            return children
          })()
        : []

    const renderedElementChildren =
      !!elementChildren?.length &&
      renderElements({
        elements: elementChildren,
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
        selectedElement,
        actions,
        onSelectElement,
        theme,
        isProduction,
        icons,
        parentId: element._id,
        isPointerProduction,
        baseComponentId,
        disableOverlay,
        rootCompositeElementId,
        OverlayComponent,
        navigate,
      })

    const TabChildren =
      !!tabChildren?.length &&
      renderElements({
        elements: tabChildren,
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
        COMPONENT_MODELS,
        selectedElement,
        actions,
        onSelectElement,
        theme,
        isProduction,
        icons,
        parentId: element._id,
        isPointerProduction,
        baseComponentId,
        disableOverlay,
        rootCompositeElementId,
        OverlayComponent,
        navigate,
      })

    const clientFilters = tableUis?.[element._id]?.filters ?? []
    const clientFiltersExSorting = clientFilters?.filter(
      (f: any) => f.filterKey !== 'sorting'
    )
    const clientFilterSorting = clientFilters?.filter(
      (f: any) => f.filterKey === 'sorting'
    )?.[0]?.value
    const [clientFilterKey, clientFilterDirection] =
      clientFilterSorting?.split?.(',') ?? []

    const clientFilteredTableData =
      getPropByName('data')?.filter?.((d: any) =>
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

    const componentEvents = (elementAdj as any)
      ?.formGen?.({
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
      })
      ?.fields?.filter((field: any) => field._prop_type === 'eventHandler')
    const componentEventNames = componentEvents?.map((ev: any) => ev.name)
    const eventHandlerProps = componentEventNames?.reduce(
      (acc: any, currentEventName: string) => {
        const eventProps = getPropByName(currentEventName)
        if (!eventProps) return acc
        return {
          ...acc,
          [currentEventName]: (fnParams: unknown) => {
            // click actions are currently assosiacted with endpoint events only!
            const clickActionIds: string[] = eventProps
            const clickActions = editorState.actions.filter((act) =>
              clickActionIds.includes(act.action_id)
            )
            const navigationActionElements = clickActionIds
              .map(
                (actId) =>
                  currentViewportElements.find((el) => el._id === actId) ?? null
              )
              .filter((el) => el)
            const navigationActionElementIds = navigationActionElements.map(
              (el) => el?._id
            ) as string[]

            // only endpoint actions
            for (let c = 0; c < clickActions.length; c++) {
              const clickAction = clickActions[c]
              const endpointId = clickAction.endpoint_id
              const endpoint = editorState.externalApis
                .map((api) =>
                  api.endpoints.map((ep) => ({
                    ...ep,
                    api_id: api.external_api_id,
                  }))
                )
                .flat()
                .find((ep) => ep.endpoint_id === endpointId)
              const api = editorState.externalApis.find(
                (api) => api.external_api_id === endpoint?.api_id
              )
              const url = (api?.baseUrl || '') + (endpoint?.url || '')
              const action = editorState.actions.find(
                (act) => act.endpoint_id === endpoint?.endpoint_id
              )
              const elementTemplateValuesDict = editorState.actionParams
                .filter((ap) => ap.element_id === element._id)
                .reduce((acc, cur) => {
                  return {
                    ...acc,
                    [cur.param_name]: cur.param_value,
                  }
                }, {})
              const isItemEvent = COMPONENT_MODELS.find(
                (mod) => mod.type === element._type
              )?.schema?.properties[currentEventName]?.eventType
              console.log(
                'ON REACT EL ACTION - ',
                currentEventName,
                clickAction,
                endpoint,
                action,
                elementTemplateValuesDict,
                isItemEvent,
                fnParams
              )
              const elementTemplateValuesDictAdj =
                isItemEvent && typeof fnParams === 'string'
                  ? Object.keys(elementTemplateValuesDict).reduce<
                      Record<string, any>
                    >((acc, cur) => {
                      const value =
                        typeof elementTemplateValuesDict?.[
                          cur as keyof typeof elementTemplateValuesDict
                        ]
                      return {
                        ...acc,
                        [cur]: value?.replaceAll?.(
                          '{itemId}',
                          fnParams as string
                        ),
                      }
                    }, {})
                  : elementTemplateValuesDict
              queryAction(
                appController,
                action?.action_id ?? '', // should never happen -> should always have action
                endpoint?.method,
                url,
                !!endpoint?.useCookies,
                {},
                endpoint?.headers,
                endpoint?.params,
                endpoint?.responseType,
                undefined,
                elementTemplateValuesDictAdj
              )
            }

            // only navigation actions
            for (let n = 0; n < navigationActionElementIds.length; n++) {
              const navElementId = navigationActionElementIds[n]
              const actionParam = editorState.actionParams.find(
                (ap) => ap.param_name === navElementId
              )
              const elementWithEvent = actionParam?.element_id
              if (!elementWithEvent) return

              appController.actions.updateProperty(
                navElementId,
                actionParam.param_value
              )
            }
          },
        }
      },
      {}
    )

    if (element._type === 'Form') {
      const formProps = {
        ...(elementPropsObject ?? {}),
        ...injectedIconsDict,
        ...elementArrayIconInjectionDict,
        formData: appController.actions.getFormData(elementAdj._id),
        onChangeFormData: (
          newFormData: any,
          propertyKey: string,
          propertyValue: any,
          prevFormData: any
        ) => {
          appController.actions.changeFormData(elementAdj._id, newFormData)
        },
        sx: !isProduction
          ? {
              ...((elementPropsObject as any)?.sx ?? {}),
              position: 'relative',
            }
          : (elementPropsObject as any)?.sx,
        rootInjection: !disableOverlay && OverlayComponent && (
          <OverlayComponent {...rootElementOverlayProps} />
        ),
        ...eventHandlerProps,
      }
      console.log('formProps', formProps)
    }

    const elementAdj2 = {
      ...elementAdj,
      _content: content,
    }
    return isHtmlElement ? (
      <ElementBox
        element={elementAdj2}
        onSelectElement={onSelectElement}
        editorState={editorState}
        actions={actions}
        appController={appController}
        currentViewportElements={currentViewportElements}
        selectedPageElements={selectedPageElements}
        selectedElement={selectedElement}
        COMPONENT_MODELS={COMPONENT_MODELS}
        key={element._id}
        isProduction={isProduction || isPointerProduction}
        isPointerProduction={isPointerProduction}
        OverlayComponent={OverlayComponent}
        navigate={navigate}
      >
        {!disableOverlay && OverlayComponent && (
          <OverlayComponent {...rootElementOverlayProps} />
        )}
        {renderedElementChildren}
      </ElementBox>
    ) : // components
    isComponentType(element._type) ? (
      ['Button', 'Chip', 'Typography'].includes(element?._type) &&
      CurrentComponent ? (
        <CurrentComponent
          key={element._id}
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          rootInjection={
            !disableOverlay &&
            OverlayComponent && (
              <OverlayComponent {...rootElementOverlayProps} />
            )
          }
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          // onClick={
          //   'onClick' in elementAdj.props
          //     ? () => {
          //         const clickActionIds: string[] = elementAdj.props.onClick
          //         const clickActions = editorState.actions.filter((act) =>
          //           clickActionIds.includes(act.action_id)
          //         )
          //         for (let c = 0; c < clickActions.length; c++) {
          //           const clickAction = clickActions[c]
          //           const endpointId = clickAction.endpoint_id
          //           const endpoint = editorState.externalApis
          //             .map((api) =>
          //               api.endpoints.map((ep) => ({
          //                 ...ep,
          //                 api_id: api.external_api_id,
          //               }))
          //             )
          //             .flat()
          //             .find((ep) => ep.endpoint_id === endpointId)
          //           const api = editorState.externalApis.find(
          //             (api) => api.external_api_id === endpoint?.api_id
          //           )
          //           const url = (api?.baseUrl ?? '') + (endpoint?.url ?? '')
          //           queryAction(
          //             endpoint?.method,
          //             url,
          //             !!endpoint?.useCookies,
          //             {},
          //             endpoint?.headers,
          //             endpoint?.params,
          //             endpoint?.responseType
          //           )
          //         }
          //       }
          //     : undefined
          // }
          {...eventHandlerProps}
        />
      ) : ['Table'].includes(element?._type) && CurrentComponent ? (
        <CurrentComponent
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          data={clientSortedFilteredTableData}
          onSetFilters={(newFilters: any) => {
            actions?.ui?.setTableFilters?.(elementAdj._id, newFilters)
          }}
          filters={tableUis?.[element._id]?.filters ?? []}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          rootInjection={
            !disableOverlay &&
            OverlayComponent && (
              <OverlayComponent {...rootElementOverlayProps} />
            )
          }
          {...eventHandlerProps}
        />
      ) : ['Form'].includes(element?._type) && CurrentComponent ? (
        <CurrentComponent
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          formData={appController.actions.getFormData(elementAdj._id)}
          onChangeFormData={
            /* eslint-disable @typescript-eslint/no-unused-vars */
            (
              newFormData: any,
              propertyKey: string,
              propertyValue: any,
              prevFormData: any
              /* eslint-enable @typescript-eslint/no-explicit-any */
            ) => {
              appController.actions.changeFormData(elementAdj._id, newFormData)
            }
          }
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          rootInjection={
            !disableOverlay &&
            OverlayComponent && (
              <OverlayComponent {...rootElementOverlayProps} />
            )
          }
          {...eventHandlerProps}
        />
      ) : //  NAVIGATION ELEMENTS (slightly different interface)
      ['Tabs', 'BottomNavigation', 'ListNavigation', 'ButtonGroup'].includes(
          element?._type
        ) && CurrentComponent ? (
        <CurrentComponent
          {...((elementPropsObject as any) ?? {})} // icon injections needed ? -> more generic approach
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          onChange={onTabChange}
          value={navValueState}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          rootInjection={
            !disableOverlay &&
            OverlayComponent && (
              <OverlayComponent {...rootElementOverlayProps} />
            )
          }
          {...eventHandlerProps}
        >
          {renderedElementChildren}
        </CurrentComponent>
      ) : element?._type === 'AppBar' ? (
        <AppBar
          {...((elementPropsObject as any) ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          sx={
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
              : { ...((elementPropsObject as any)?.sx ?? {}) }
          }
          onChange={onTabChange}
          value={navValueState}
          {...eventHandlerProps}
        >
          {renderedElementChildren}
          {!disableOverlay && OverlayComponent && (
            <OverlayComponent {...rootElementOverlayProps} />
          )}
        </AppBar>
      ) : ['Paper', 'Dialog'].includes(element?._type) ? (
        <CurrentComponent
          {...((elementPropsObject as any) ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          onChange={onTabChange}
          value={navValueState}
          {...eventHandlerProps}
        >
          {renderedElementChildren}
          {!disableOverlay && OverlayComponent && (
            <OverlayComponent {...rootElementOverlayProps} />
          )}
        </CurrentComponent>
      ) : // Navigation Container -> specific render case (but could be component, too)
      element?._type === 'NavContainer' ? (
        (() => {
          const { children, ...childLessProps } =
            (elementPropsObject as any) ?? {}

          return (
            <Box
              {...(childLessProps ?? {})}
              {...eventHandlerProps}
              {...injectedIconsDict}
              {...elementArrayIconInjectionDict}
            >
              {TabChildren}
            </Box>
          )
        })()
      ) : (
        <CurrentComponent
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          rootInjection={
            !disableOverlay &&
            OverlayComponent && (
              <OverlayComponent {...rootElementOverlayProps} />
            )
          }
          {...eventHandlerProps}
        />
      )
    ) : null
  })
  return rawElements
}
