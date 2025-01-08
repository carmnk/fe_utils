import { ComponentDefType } from '../../editorComponents'
import {
  AppController,
  EditorRendererControllerType,
  EditorStateType,
} from '../../editorRendererController'
import { Element, Property } from '../../editorRendererController'
import { isComponentType } from '../../utils'
import { createAppAction } from './createAppAction'
import { htmlEventCategories } from './htmlElementEvents'
import { NavigateFunction } from 'react-router-dom'

export type GetElementEventHandlersParams = {
  element: Element
  editorState: EditorStateType
  appController: AppController
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType['COMPONENT_MODELS']
  icons?: Record<string, string>
  elementProps: Property[]
  navigate: NavigateFunction
  isProduction?: boolean
}
export const getElementEventHandlerProps = (
  params: GetElementEventHandlersParams
) => {
  const {
    element,
    editorState,
    appController,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    icons,
    elementProps,
    navigate,
    isProduction,
  } = params

  const isReactElement = isComponentType(element._type)
  const getPropByName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.prop_value

  const componentEventNames = (() => {
    if (isReactElement) {
      const componentDef = element as unknown as ComponentDefType
      const fieldsRaw = componentDef?.formGen?.({
        editorState,
        appController,
        currentViewportElements,
        selectedPageElements,
      })?.fields
      const fields =
        typeof fieldsRaw === 'function'
          ? (componentDef.props &&
              fieldsRaw(componentDef.props, componentDef.props)) ||
            []
          : fieldsRaw
      const componentEvents = fields?.filter(
        (field) => field._prop_type === 'eventHandler'
      )
      return componentEvents?.map((ev) => ev.name) ?? []
    } else {
      return htmlEventCategories
        .map((category) => {
          return category.eventNames
        })
        .flat()
    }
  })()

  const eventHandlerProps = componentEventNames?.reduce<
    Record<string, ((...fnParams: unknown[]) => void) | undefined>
  >((acc, currentEventName: string) => {
    const eventProps = getPropByName(currentEventName)
    if (!eventProps) return acc
    return {
      ...acc,
      [currentEventName]: isReactElement
        ? createAppAction({
            element,
            eventName: currentEventName,
            editorState,
            currentViewportElements,
            COMPONENT_MODELS,
            appController,
            icons,
            navigate,
            isProduction,
          })
        : () => {
            return createAppAction({
              element,
              eventName: currentEventName,
              editorState,
              currentViewportElements,
              COMPONENT_MODELS,
              appController,
              icons,
              navigate,
              isProduction,
            })
          },
    }
  }, {})

  // Special render case for renderType = Form
  const baseComponent =
    isComponentType(element._type) &&
    COMPONENT_MODELS.find((comp) => comp.type === element._type)
  if (
    baseComponent &&
    'renderType' in baseComponent &&
    baseComponent.renderType === 'form'
  ) {
    eventHandlerProps.formData =
      (getPropByName('formData') as any) ??
      (appController.actions.getFormData(element._id) as any)
    eventHandlerProps.onChangeFormData = eventHandlerProps?.onChangeFormData
      ? (((newFormData: Record<string, unknown>) =>
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
          })?.(null, newFormData)) as any)
      : (
          newFormData: Record<string, unknown>
          // propertyKey: string,
          // propertyValue: any,
          // prevFormData: any
        ) => {
          appController.actions.changeFormData(element._id, newFormData)
        }
  }
  return eventHandlerProps
}
