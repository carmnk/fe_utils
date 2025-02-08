import { ElementModel } from '../../editorComponents'
import {
  AppController,
  EditorRendererControllerType,
  EditorStateType,
} from '../../editorRendererController'
import { Element, Property } from '../../editorRendererController'
import { isComponentType } from '../../utils'
import { createAppAction } from './createAppAction'
import { htmlEventCategories } from './htmlElementEvents'

export type GetElementEventHandlersParams = {
  element: Element
  editorState: EditorStateType
  appController: AppController
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  ELEMENT_MODELS: EditorRendererControllerType['ELEMENT_MODELS']
  icons?: Record<string, string>
  elementProps: Property[]
  navigate: (to: string) => void
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
    ELEMENT_MODELS,
    icons,
    elementProps,
    navigate,
    isProduction,
  } = params

  const isReactElement = isComponentType(element.element_type)
  const getPropByName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.prop_value

  const componentEventNames = (() => {
    if (isReactElement) {
      const componentDef = element as unknown as ElementModel
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

  const eventHandlerProps = componentEventNames?.reduce<{
    [key: string]:
      | ((...fnParams: unknown[]) => void)
      | ((newFormData: Record<string, unknown>) => void)
      | Record<string, unknown>
      | undefined
    onChangeFormData?: (newFormData: Record<string, unknown>) => void
  }>((acc, currentEventName: string) => {
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
            ELEMENT_MODELS,
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
              ELEMENT_MODELS,
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
    isComponentType(element.element_type) &&
    ELEMENT_MODELS.find((comp) => comp.type === element.element_type)
  if (
    baseComponent &&
    'renderType' in baseComponent &&
    baseComponent.renderType === 'form'
  ) {
    eventHandlerProps.formData =
      (getPropByName('formData') as Record<string, unknown>) ??
      appController.actions.getFormData(element.element_id)
    eventHandlerProps.onChangeFormData = eventHandlerProps?.onChangeFormData
      ? (newFormData: Record<string, unknown>) =>
          createAppAction?.({
            element,
            eventName: 'onChangeFormData',
            editorState,
            currentViewportElements,
            ELEMENT_MODELS,
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
          appController.actions.changeFormData(element.element_id, newFormData)
        }
  }
  return eventHandlerProps
}
