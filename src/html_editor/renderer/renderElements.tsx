import { EditorStateType, Element } from '../editorRendererController/types'
import { ElementBox } from './ElementBox'
import { Box, Theme } from '@mui/material'
import { EditorRendererControllerType } from '../editorRendererController/types/editorRendererController'
import { isComponentType, isStringLowerCase } from './utils'
import {
  checkForPlaceholders,
  replacePlaceholdersInString,
} from './placeholder/replacePlaceholder'
import { FC, ReactNode, ComponentType } from 'react'
import { getInjectedElementIconProps } from './icons/getInjectedElementIconProps'
import { NavigateFunction } from 'react-router-dom'
import { resolveElementProps } from './placeholder/resolveElementProps'
import { renderElementChildren } from './renderElementChildren'
import { getElementEventHandlerProps } from './actions/getElementEventHandlerProps'
import { getReactElementProps } from './getReactElementProps'

// const ANY_PLACEHOLDER_REGEX =
//   /{(_data|form|props|treeviews|buttonStates)\.[^}]*}/g

export const renderElements = <
  ControllreUiActionsType extends Record<string, unknown>,
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
  debug?: any
  navigate: NavigateFunction
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
    debug,
  } = params

  const tableUis = editorState.ui.tableUis

  const relevantElements = (
    !parentId
      ? elements?.filter((el) => !el._parentId)
      : elements?.filter((el) => el._parentId === parentId)
  )?.filter(
    (el) =>
      !(baseComponentId && el.component_id) || //
      (baseComponentId && el.component_id === baseComponentId) ||
      (!baseComponentId && el._page === editorState.ui.selected.page)
  )
  if (debug) {
    console.debug(
      'relevant elements  ',
      elements,
      relevantElements,
      parentId,
      baseComponentId,
      editorState.ui.selected.page,
      'PT1',
      !parentId
        ? elements?.filter((el) => !el._parentId)
        : elements?.filter((el) => el._parentId === parentId)
    )
  }

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

    const schemaProps = (element as any)?.schema?.properties ?? {}
    const baseComponent = COMPONENT_MODELS?.find(
      (com) => com.type === element?._type
    )
    const CurrentComponent =
      baseComponent &&
      'component' in baseComponent &&
      (baseComponent.component as ComponentType<'Button'>)

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
      selectedElement,
      icons,
    })

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

    const renderedElementChildren = renderElementChildren({
      element,
      elementProps: allElementProps,
      editorState,
      appController,
      theme,
      currentViewportElements,
      selectedPageElements,
      COMPONENT_MODELS,
      uiActions,
      selectedElement,
      onSelectElement,
      isProduction,
      icons,
      isPointerProduction,
      disableOverlay,
      rootCompositeElementId,
      OverlayComponent,
      navigate,
    })

    const eventHandlerProps = getElementEventHandlerProps({
      element,
      editorState,
      appController,
      currentViewportElements,
      selectedPageElements,
      COMPONENT_MODELS,
      icons,
      elementProps: allElementProps,
    })

    const specificReactElementProps = getReactElementProps({
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
    })

    const elementAdj2 = {
      ...element,
      content,
      props: {
        ...(elementPropsObject ?? {}),
        ...injectedIconProps,
      },
      _content: content,
    }

    if (
      element?._id === 'e9780d0e-c07b-4b1b-90ba-5562f7915e65' ||
      ['svg', 'polygon'].includes(element._type)
    ) {
      console.debug('elementAdj2  ', elementAdj2, renderedElementChildren)
    }
    if (
      element?._parentId === 'e9780d0e-c07b-4b1b-90ba-5562f7915e65' ||
      debug
    ) {
      console.debug(
        'elementAdj  43333   ',
        debug,
        elementAdj2,
        renderedElementChildren
      )
    }

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
        events={eventHandlerProps}
      >
        {rootInjectionOverlayComponent}
        {renderedElementChildren}
      </ElementBox>
    ) : // components

    isComponentType(element._type) && CurrentComponent ? (
      //  NAVIGATION ELEMENTS (slightly different interface)
      [
        'Tabs',
        'BottomNavigation',
        'ListNavigation',
        'ButtonGroup',
        'Paper',
        'Dialog',
        'AppBar',
      ].includes(element?._type) && CurrentComponent ? (
        <CurrentComponent
          key={element._id}
          {...((elementPropsObject as any) ?? {})} // icon injections needed ? -> more generic approach
          {...injectedIconProps}
          sx={
            !isProduction
              ? {
                  ...((elementPropsObject as any)?.sx ?? {}),
                  position: 'relative',
                }
              : (elementPropsObject as any)?.sx
          }
          rootInjection={
            ['Paper', 'Dialog', 'AppBar'].includes(element._type)
              ? undefined
              : rootInjectionOverlayComponent
          }
          {...eventHandlerProps}
          {...specificReactElementProps}
        >
          {renderedElementChildren}
          {/* these dont have the rootInjection interface yet */}
          {['Paper', 'Dialog', 'AppBar'].includes(element._type) &&
            rootInjectionOverlayComponent}
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
              {...injectedIconProps}
            >
              {renderedElementChildren}
            </Box>
          )
        })()
      ) : (
        // ['Button', 'Chip', 'Typography', 'Table', 'Form', 'Icon']
        <CurrentComponent
          key={element._id}
          {...(elementPropsObject ?? {})}
          {...injectedIconProps}
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
          {...specificReactElementProps}
        />
      )
    ) : null
  })
  return renderedElements
}
