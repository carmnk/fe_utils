import { EditorStateType, Element } from '../types'
import { ElementBox } from './ElementBox'
import { Box, BoxProps, Theme } from '@mui/material'
import { EditorRendererControllerType } from '../types/editorRendererController'
import { isStringLowerCase } from '../utils'
import {
  checkForPlaceholders,
  replacePlaceholdersInString,
} from './placeholder/replacePlaceholder'
import { FC, PropsWithChildren, ReactNode } from 'react'
import { getInjectedElementIconProps } from './icons/getInjectedElementIconProps'
import { getElementResolvedPropsDict } from './properties/getElementProperties'
import { getElementEventHandlerProps } from './actions/getElementEventHandlerProps'
import { ElementModel } from '../editorComponents'
import { ComponentBox } from './ComponentBox'

// const ANY_PLACEHOLDER_REGEX =
//   /{(_data|form|props|treeviews|buttonStates)\.[^}]*}/g

export const renderElements = (params: {
  elements: Element[]
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType['appController']
  currentViewportElements: Element[]
  ELEMENT_MODELS: EditorRendererControllerType['ELEMENT_MODELS']
  uiActions?: unknown
  //
  onSelectElement: (element: Element, isHovering: boolean) => void
  theme: Theme
  isProduction?: boolean
  icons: Record<string, string>
  parentId?: string
  isPointerProduction?: boolean
  baseComponentId?: string
  disableOverlay?: boolean
  rootCompositeElementId?: string
  OverlayComponent?: FC<{ element: Element }>
  disableElementEvents?: boolean
  navigate: (to: string) => void
}): ReactNode => {
  const {
    elements,
    editorState,
    appController,
    currentViewportElements,
    ELEMENT_MODELS,
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
    disableElementEvents,
    navigate,
  } = params

  const currentViewport = editorState.ui.selected.viewport
  const isCurrentViewportAutarkic = currentViewportElements.find(
    (el) => !el.parent_id && !el.component_id && el.viewport === currentViewport
  )

  const currentPageViewportElements = currentViewportElements.filter(
    (el) => el.element_page === editorState.ui.selected.page
  )

  const relevantElements = (
    !parentId
      ? elements?.filter((el) => !el.parent_id)
      : elements?.filter((el) => el.parent_id === parentId)
  )?.filter(
    (el) =>
      !(baseComponentId && el.component_id) || //
      (baseComponentId && el.component_id === baseComponentId) ||
      (!baseComponentId && el.element_page === editorState.ui.selected.page)
  )

  const renderedElements = relevantElements.map((element) => {
    const typeFirstLetter = element.element_type.slice(0, 1)
    const isHtmlElement = isStringLowerCase(typeFirstLetter)
    const elementProps = editorState.properties?.filter(
      (prop) => prop.element_id === element.element_id
    )
    const templateProps = editorState.properties?.filter(
      (prop) =>
        prop.template_id === element.template_id &&
        !elementProps.find((elprop) => elprop.prop_name === prop.prop_name)
    )
    const allElementProps = [...(elementProps ?? []), ...(templateProps ?? [])]

    const schemaProps =
      (element as unknown as ElementModel)?.schema?.properties ?? {}
    const baseComponent = ELEMENT_MODELS?.find(
      (com) => com.type === element?.element_type
    )
    const CurrentComponentIn =
      (baseComponent &&
        'component' in baseComponent &&
        baseComponent.component) ||
      Box
    const CurrentComponent = CurrentComponentIn as
      | FC<PropsWithChildren<Record<string, unknown>>>
      | undefined

    // icon injections
    const injectedIconProps = getInjectedElementIconProps({
      element,
      schemaProps,
      icons,
      isHtmlElement,
      elementProps: allElementProps,
    })
    // props
    // const elementPropsObject = resolveElementProps({
    //   element,
    //   rootCompositeElementId,
    //   editorState,
    //   appController,
    //   elementProps: allElementProps,
    //   icons,
    // })
    const elementPropsObject = getElementResolvedPropsDict({
      element,
      rootCompositeElementId,
      editorState,
      appController,
      icons,
      viewport: editorState.ui.selected.viewport,
    })

    const matches = !!element?.content && checkForPlaceholders(element?.content)
    const content = matches
      ? replacePlaceholdersInString(
          element.content ?? '',
          appController.state,
          editorState.composite_component_props,
          editorState.properties,
          element,
          rootCompositeElementId,
          undefined,
          icons
        )
      : element.content

    const relevantElementsForChildren = baseComponentId
      ? editorState.elements
      : currentViewportElements

    const elementChildren =
      relevantElementsForChildren?.filter(
        (el) =>
          el.parent_id === element.element_id &&
          element.element_id &&
          (!currentViewport ||
            currentViewport === 'xs' ||
            (isCurrentViewportAutarkic && el.viewport === currentViewport) ||
            (() => {
              if (isCurrentViewportAutarkic) return false
              // if viewport specific children then only show them otherwise adaptive with default
              const hasSpecificViewportChildren =
                relevantElementsForChildren?.find(
                  (el) =>
                    el.parent_id === element.element_id &&
                    element.element_id &&
                    el.viewport === currentViewport
                )
              return hasSpecificViewportChildren
                ? el.viewport === currentViewport
                : !el.viewport || el.viewport === 'xs'
            })())
      ) ?? []

    // console.log('elementChildren', elementChildren, element.element_type)

    const renderedElementChildren = elementChildren?.length
      ? renderElements({
          elements: elementChildren,
          editorState,
          appController,
          currentViewportElements,
          ELEMENT_MODELS,
          uiActions,
          onSelectElement,
          theme,
          isProduction,
          icons,
          parentId: element.element_id,
          isPointerProduction,
          baseComponentId,
          disableOverlay,
          rootCompositeElementId,
          OverlayComponent,
          navigate,
        })
      : []

    const eventHandlerProps = disableElementEvents
      ? {}
      : getElementEventHandlerProps({
          element,
          editorState,
          appController,
          currentViewportElements,
          selectedPageElements: currentPageViewportElements,
          ELEMENT_MODELS,
          icons,
          elementProps: allElementProps,
          navigate,
          isProduction,
        })

    const elementAdj2 = {
      ...element,
      content,
      props: {
        ...(elementPropsObject ?? {}),
        ...injectedIconProps,
      },
    }

    const rootInjectionOverlayComponent = !disableOverlay &&
      OverlayComponent && <OverlayComponent element={elementAdj2} />

    return element?.element_type === 'composite' ? (
      <ComponentBox
        element={element}
        editorState={editorState}
        appController={appController}
        currentViewportElements={currentViewportElements}
        selectedPageElements={currentPageViewportElements}
        ELEMENT_MODELS={ELEMENT_MODELS}
        selectedElement={element}
        uiActions={uiActions}
        isProduction={!!isProduction}
        OverlayComponent={OverlayComponent}
        navigate={navigate}
        rootCompositeElementId={rootCompositeElementId}
      />
    ) : isHtmlElement ? (
      <ElementBox
        key={element.element_id}
        element={elementAdj2}
        onSelectElement={onSelectElement}
        editorState={editorState}
        appController={appController}
        isProduction={isProduction}
        isPointerProduction={isPointerProduction}
        navigate={navigate}
        events={
          eventHandlerProps as {
            [key: string]: ((...fnParams: unknown[]) => void) | undefined
          }
        }
        rootCompositeElementId={rootCompositeElementId}
      >
        {rootInjectionOverlayComponent}
        {renderedElementChildren}
      </ElementBox>
    ) : // components
    // Navigation Container -> specific render case (but could be component, too)
    CurrentComponent && baseComponent?.renderType === 'custom' ? (
      (() => {
        return (
          <CurrentComponent
            {...(elementPropsObject ?? {})}
            {...eventHandlerProps}
            {...injectedIconProps}
            appController={appController}
            id={element.element_id}
            isProduction={isProduction}
            editorStateUi={editorState.ui}
            editorState={editorState}
            currentViewportElements={currentViewportElements}
            ELEMENT_MODELS={ELEMENT_MODELS}
            uiActions={uiActions}
            onSelectElement={onSelectElement}
            theme={theme}
            icons={icons}
            parentId={element.element_id}
            isPointerProduction={isPointerProduction}
            baseComponentId={baseComponentId}
            disableOverlay={disableOverlay}
            rootCompositeElementId={rootCompositeElementId}
            OverlayComponent={OverlayComponent}
            key={element.element_id + '_component'}
          ></CurrentComponent>
        )
      })()
    ) : CurrentComponent ? (
      <CurrentComponent
        {...(elementPropsObject ?? {})}
        {...injectedIconProps}
        // rootInjection={rootInjectionOverlayComponent}
        sx={
          !isProduction &&
          !['Dialog', 'AppBar'].includes(element.element_type) &&
          (!elementPropsObject?.position ||
            elementPropsObject?.position === 'relative')
            ? {
                ...(elementPropsObject?.sx ?? {}),
                position: 'relative',
              }
            : (elementPropsObject?.sx as BoxProps['sx'])
        }
        {...(['Paper', 'Dialog', 'AppBar'].includes(element.element_type)
          ? {}
          : {
              rootInjection: rootInjectionOverlayComponent,
            })}
        {...eventHandlerProps}
        appController={appController}
        id={element.element_id}
        isProduction={isProduction}
        editorStateUi={editorState.ui}
        key={element.element_id}
        assets={editorState.assets}
        icons={icons}
      >
        {renderedElementChildren}
        {elementPropsObject?.children as ReactNode}
        {/* these dont have the rootInjection interface yet */}
        {['Paper', 'Dialog', 'AppBar'].includes(element.element_type) &&
          !isProduction &&
          !isPointerProduction &&
          rootInjectionOverlayComponent}
      </CurrentComponent>
    ) : null
  })
  return renderedElements
}
