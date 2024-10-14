import { EditorStateType, Element } from '../editorRendererController/types'
import { ElementBox } from './ElementBox'
import { AppBar, Box, Theme } from '@mui/material'
import { EditorRendererControllerType } from '../editorRendererController/types/editorRendererController'
import { PropertyType } from '../editorComponents/schemaTypes'
import { isComponentType, isStringLowerCase } from './utils'
import {
  checkForPlaceholders,
  replacePlaceholdersInString,
} from './placeholder/replacePlaceholder'
import { FC, ReactNode, ComponentType } from 'react'
import { createAppAction } from './createAppAction'

export const renderElements = <
  ControllreUiActionsType extends { [key: string]: any },
  FastState,
>(params: {
  elements: Element[]
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType<ControllreUiActionsType>['appController']
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType<ControllreUiActionsType>['COMPONENT_MODELS']
  selectedElement: Element | null
  uiActions?: ControllreUiActionsType
  //
  onSelectElement: (element: Element, isHovering: boolean) => void
  theme: Theme
  isProduction?: boolean
  icons?: { [key: string]: string }
  parentId?: string
  isPointerProduction?: boolean
  baseComponentId?: string
  disableOverlay?: boolean
  rootCompositeElementId?: string
  OverlayComponent?: FC<{ element: Element }>
  navigate: any
}): ReactNode => {
  const {
    elements,
    editorState,
    appController,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    selectedElement,
    uiActions,
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

  const relevantElements = (
    !parentId
      ? elements?.filter((el) => !el._parentId)
      : elements?.filter((el) => el._parentId === parentId)
  )?.filter(
    (el) =>
      (baseComponentId && el.component_id === baseComponentId) ||
      (!baseComponentId && el._page === editorState.ui.selected.page)
  )

  const renderedElements = relevantElements.map((element) => {
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
    // icon injections
    const elementIconKeys = isHtmlElement
      ? []
      : Object.keys(schemaProps)?.filter(
          (key) => schemaProps[key]?.type === PropertyType.icon
        )
    // e.g. {...., icon: mdiPencil, ... }
    const injectedIconsDict = elementIconKeys?.reduce(
      (acc, key) => ({
        ...acc,
        [key]: icons?.[getPropByName(key)],
      }),
      {}
    )
    // icon injections for array elements
    const elementArrayIconKeys = isHtmlElement
      ? []
      : Object.keys(schemaProps)?.filter((key) => {
          const itemsProps = (schemaProps?.[key] as any)?.items?.[0]?.properties
          return (
            schemaProps[key]?.type === PropertyType.Array &&
            Object.keys(itemsProps || {})?.filter?.(
              (key) => itemsProps[key]?.type === PropertyType.icon
            )
          )
        })
    const elementArrayIconInjectionDict = element?._type
      ?.toLowerCase()
      .includes('treeview')
      ? {}
      : elementArrayIconKeys
          .map((key) => {
            const itemsProps = (schemaProps?.[key] as any)?.items?.[0]
              ?.properties
            return Object.keys(itemsProps || {})
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

    const baseComponent = COMPONENT_MODELS?.find(
      (com) => com.type === element?._type
    )
    const CurrentComponent =
      baseComponent &&
      'component' in baseComponent &&
      (baseComponent.component as ComponentType<any>)

    // props
    const elementPropsObject = allElementProps.reduce<Record<string, any>>(
      (acc, cur) => {
        const key = cur.prop_name
        const keyValue = getPropByName(key)
        const matches = keyValue?.match?.(
          /{(_data|form|props|treeviews|buttonStates)\.[^}]*}/g
        )
        const keyValueAdj = matches
          ? replacePlaceholdersInString(
              keyValue,
              appController.state,
              editorState.compositeComponentProps,
              editorState.properties,
              element as any,
              rootCompositeElementId,
              undefined,
              icons
            )
          : keyValue

        const isFormularInput = keyValue !== keyValueAdj
        const transformerStr = editorState.transformers.find(
          (tr) => tr.prop_id === cur.prop_id && tr.element_id === element._id
        )?.transformer_string
        const transformerFn =
          isFormularInput && transformerStr
            ? replacePlaceholdersInString(
                transformerStr,
                appController.state,
                editorState.compositeComponentProps,
                editorState.properties,
                selectedElement,
                undefined,
                true,
                icons,
                true
              )
            : null

        // if (
        //   transformerFn &&
        //   element?._type?.toLowerCase().includes('treeview')
        // ) {
        //   console.log('transformerFn', transformerFn, transformerStr, icons)
        // }
        const keyValueAdj2 =
          typeof transformerFn === 'function' && Array.isArray(keyValueAdj)
            ? transformerFn?.(keyValueAdj)
            : keyValueAdj
        return {
          ...acc,
          [key]: keyValueAdj2,
        }
      },
      {}
    )

    // const regex = /{(_data|form|props)\.[^}]*}/g
    // const matches = element._content?.match?.(regex)
    const matches =
      !!element?._content && checkForPlaceholders(element?._content)
    const content = matches
      ? replacePlaceholdersInString(
          element._content ?? '',
          appController.state,
          editorState.compositeComponentProps,
          editorState.properties,
          selectedElement,
          rootCompositeElementId,
          undefined,
          icons
        )
      : element._content

    const elementAdj = {
      ...element,
      content,
      props: {
        ...(elementPropsObject ?? {}),
        ...injectedIconsDict,
        ...elementArrayIconInjectionDict,
      },
    }

    const navValueState = (appController as any)?.state?.[element?._id] ?? []
    const onTabChange = (tabValue: string) => {
      appController.actions.updateProperty(element?._id, tabValue)
    }
    const open = (appController as any)?.state?.[element?._id]
    const handleToggleOpen = () => {
      appController.actions.updateProperty(element?._id, !open)
    }
    const treeViewSelectedState =
      appController?.state?.treeviews?.selectedId[element?._id] ?? {}
    const onTreeViewSelectionChange = (e: any, itemId: string) => {
      const item = elementPropsObject?.items?.find(
        (item: any) => item.nodeId === itemId
      )
      appController.actions.changeTreeviewSelectedItem(
        element?._id,
        itemId,
        item
      )
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
            const sourceControlElement = currentViewportElements?.find(
              (el) => el._id === sourceControlElementId
            )
            const activeTab =
              sourceControlElement?._type === 'Button'
                ? appController?.state?.buttonStates?.[sourceControlElementId]
                : appController?.state?.[sourceControlElementId]
            const activeId = getPropByName('items')?.find(
              (item: any) => item.value === activeTab
            )?.childId
            const activeChild = elementChildren?.find?.(
              (child) => child._id === activeId
            )
            const children = activeChild ? [activeChild] : []
            console.log(
              'TAB CHILDREN SRC',
              sourceControlElementId,
              activeTab,
              activeId,
              activeChild,
              children,
              'appcontroller',
              appController
            )
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
        uiActions,
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
        uiActions,
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

    console.log('TAB CILDREN', TabChildren)

    const tableProps =
      ['Table'].includes(element?._type) && CurrentComponent
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
                uiActions?.setTableFilters?.(elementAdj._id, newFilters)
              },
              filters: clientFilters,
            }
          })()
        : {}

    const treeViewProps =
      element?._type?.toLowerCase().includes('treeview') && CurrentComponent
        ? (() => {
            return {
              selectedItems: treeViewSelectedState,
              onNodeSelect: onTreeViewSelectionChange,
            }
          })()
        : {}

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
          [currentEventName]: createAppAction({
            element,
            eventName: currentEventName,
            editorState,
            currentViewportElements,
            COMPONENT_MODELS,
            appController,
            icons,
          }),
        }
      },
      {}
    )

    const formProps =
      ['Form'].includes(element?._type) && CurrentComponent
        ? (() => {
            return {
              formData:
                elementPropsObject?.formData ??
                appController.actions.getFormData(elementAdj._id),
              onChangeFormData: eventHandlerProps?.onChangeFormData
                ? (newFormData: any) =>
                    createAppAction({
                      element,
                      eventName: 'onChangeFormData',
                      editorState,
                      currentViewportElements,
                      COMPONENT_MODELS,
                      appController,
                      icons,
                      formData: newFormData,
                    })(newFormData)
                : /* eslint-disable @typescript-eslint/no-unused-vars */
                  (
                    newFormData: any,
                    propertyKey: string,
                    propertyValue: any,
                    prevFormData: any
                    /* eslint-enable @typescript-eslint/no-explicit-any */
                  ) => {
                    appController.actions.changeFormData(
                      elementAdj._id,
                      newFormData
                    )
                  },
            }
          })()
        : {}

    const elementAdj2 = {
      ...elementAdj,
      _content: content,
    }

    if (element?._type?.toLowerCase().includes('form'))
      console.log(
        'elementAdj2  ',
        elementAdj2,

        elementPropsObject,
        'NOT?',
        treeViewProps,
        formProps,
        tableProps,
        'maybe?',
        eventHandlerProps,
        injectedIconsDict,
        'elementIconKeys',
        elementIconKeys,
        elementArrayIconInjectionDict,
        'allElementProps',
        allElementProps,
        'formProps',
        formProps
      )

    const buttonOnClickProps =
      element._type === 'Button'
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
        : {}

    const rootInjectionOverlayComponent = !disableOverlay &&
      OverlayComponent && <OverlayComponent element={elementAdj2} />

    return isHtmlElement ? (
      <ElementBox
        key={element._id}
        element={elementAdj2}
        onSelectElement={onSelectElement}
        editorState={editorState}
        uiActions={uiActions}
        appController={appController}
        currentViewportElements={currentViewportElements}
        selectedPageElements={selectedPageElements}
        selectedElement={selectedElement}
        COMPONENT_MODELS={COMPONENT_MODELS}
        isProduction={isProduction || isPointerProduction}
        isPointerProduction={isPointerProduction}
        OverlayComponent={OverlayComponent}
        navigate={navigate}
      >
        {rootInjectionOverlayComponent}
        {renderedElementChildren}
      </ElementBox>
    ) : // components

    isComponentType(element._type) ? (
      (['Button', 'Chip', 'Typography', 'Table', 'Form', 'Icon'].includes(
        element?._type
      ) ||
        element?._type?.toLowerCase().includes('treeview')) &&
      CurrentComponent ? (
        <CurrentComponent
          key={element._id}
          {...(elementPropsObject ?? {})}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          rootInjection={rootInjectionOverlayComponent}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          {...eventHandlerProps}
          {...formProps}
          {...tableProps}
          {...treeViewProps}
          {...buttonOnClickProps}
        />
      ) : //  NAVIGATION ELEMENTS (slightly different interface)
      ['Tabs', 'BottomNavigation', 'ListNavigation', 'ButtonGroup'].includes(
          element?._type
        ) && CurrentComponent ? (
        <CurrentComponent
          key={element._id}
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
          rootInjection={rootInjectionOverlayComponent}
          {...eventHandlerProps}
        >
          {renderedElementChildren}
        </CurrentComponent>
      ) : element?._type === 'AppBar' ? (
        <AppBar
          key={element._id}
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
          {rootInjectionOverlayComponent}
        </AppBar>
      ) : ['Paper', 'Dialog'].includes(element?._type) ? (
        <CurrentComponent
          key={element._id}
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
          {...(!isProduction && { disablePortal: true })}
          onChange={onTabChange}
          value={navValueState}
          open={open}
          onClose={handleToggleOpen}
          {...eventHandlerProps}
        >
          {renderedElementChildren}
          {rootInjectionOverlayComponent}
        </CurrentComponent>
      ) : // Navigation Container -> specific render case (but could be component, too)
      element?._type === 'NavContainer' ? (
        (() => {
          const { children, ...childLessProps } =
            (elementPropsObject as any) ?? {}

          return (
            <Box
              key={element._id}
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
          key={element._id}
          {...injectedIconsDict}
          {...elementArrayIconInjectionDict}
          //  array icons and elementprops collide but elementprops is used when querriying
          {...(elementPropsObject ?? {})}
          rootInjection={rootInjectionOverlayComponent}
          {...eventHandlerProps}
        />
      )
    ) : null
  })
  return renderedElements
}
