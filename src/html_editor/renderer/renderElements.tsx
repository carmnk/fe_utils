import { EditorStateType, Element } from '../types'
import { ElementBox } from './ElementBox'
import { Box, BoxProps, Theme } from '@mui/material'
import { EditorRendererControllerType } from '../types/editorRendererController'
import { isStringLowerCase } from '../utils'
import {
  checkForPlaceholders,
  replacePlaceholdersInString,
} from './placeholder/replacePlaceholder'
import { FC, ReactNode } from 'react'
import { getInjectedElementIconProps } from './icons/getInjectedElementIconProps'
import { NavigateFunction } from 'react-router-dom'
import { resolveElementProps } from './placeholder/resolveElementProps'
import { getElementEventHandlerProps } from './actions/getElementEventHandlerProps'
import { ComponentDefType } from '../editorComponents'

// const ANY_PLACEHOLDER_REGEX =
//   /{(_data|form|props|treeviews|buttonStates)\.[^}]*}/g

export const renderElements = (params: {
  elements: Element[]
  //
  editorState: EditorStateType
  appController: EditorRendererControllerType['appController']
  currentViewportElements: Element[]
  selectedPageElements: Element[]
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
  debug?: unknown
  navigate: NavigateFunction
}): ReactNode => {
  const {
    elements,
    editorState,
    appController,
    currentViewportElements,
    selectedPageElements,
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
    navigate,
    debug,
  } = params

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
      (element as unknown as ComponentDefType)?.schema?.properties ?? {}
    const baseComponent = ELEMENT_MODELS?.find(
      (com) => com.type === element?.element_type
    )
    const CurrentComponentIn =
      (baseComponent &&
        'component' in baseComponent &&
        baseComponent.component) ||
      Box
    const CurrentComponent = CurrentComponentIn as FC<any> | undefined

    // icon injections
    const injectedIconProps = getInjectedElementIconProps({
      element,
      schemaProps,
      icons,
      isHtmlElement,
      elementProps: allElementProps,
    })
    // props
    const elementPropsObject = resolveElementProps({
      element,
      rootCompositeElementId,
      editorState,
      appController,
      elementProps: allElementProps,
      icons,
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

    const elementChildren =
      (baseComponentId
        ? editorState.elements
        : currentViewportElements
      )?.filter(
        (el) => el.parent_id === element.element_id && element.element_id
      ) ?? []

    const renderedElementChildren = elementChildren?.length
      ? renderElements({
          elements: elementChildren,
          editorState,
          appController,
          currentViewportElements,
          selectedPageElements,
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
          debug: true,
        })
      : []

    const eventHandlerProps = getElementEventHandlerProps({
      element,
      editorState,
      appController,
      currentViewportElements,
      selectedPageElements,
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

    return isHtmlElement ? (
      <ElementBox
        key={element.element_id}
        element={elementAdj2}
        onSelectElement={onSelectElement}
        editorState={editorState}
        uiActions={uiActions}
        appController={appController}
        currentViewportElements={currentViewportElements}
        selectedPageElements={selectedPageElements}
        selectedElement={element}
        ELEMENT_MODELS={ELEMENT_MODELS}
        isProduction={isProduction}
        isPointerProduction={isPointerProduction}
        OverlayComponent={OverlayComponent}
        navigate={navigate}
        events={eventHandlerProps}
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
          !isProduction
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
      >
        {renderedElementChildren}
        {elementPropsObject?.children}
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
