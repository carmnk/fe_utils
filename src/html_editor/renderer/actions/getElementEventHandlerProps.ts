import { ElementModel } from '../../editorComponents'
import {
  AppController,
  EditorRendererControllerType,
  EditorStateType,
} from '../../editorRendererController'
import { Element, Property } from '../../editorRendererController'
import { isComponentType } from '../../utils/utils'
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
    ELEMENT_MODELS,
    icons,
    elementProps,
    navigate,
    isProduction,
  } = params

  const isReactElement = isComponentType(element.element_type)
  const getPropByName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.prop_value
  const getEventActionIdsByEventName = (key: string) =>
    elementProps?.find((prop) => prop.prop_name === key)?.action_ids

  const elementModerlEventNames = (() => {
    if (isReactElement) {
      const elementModel = element as unknown as ElementModel
      const elementModelSchema = elementModel?.schema
      const elementModelSchemaProperties = elementModelSchema?.properties ?? {}
      const elementModelSchemaPropertyKeys = Object.keys(
        elementModelSchemaProperties
      )
      const elementModelEventHandlerNames =
        elementModelSchemaPropertyKeys.filter(
          (propertyName) =>
            elementModelSchemaProperties[propertyName].category === 'events'
        )

      return elementModelEventHandlerNames ?? []
    } else {
      return htmlEventCategories
        .map((category) => {
          return category.eventNames
        })
        .flat()
    }
  })()

  const eventHandlerProps = elementModerlEventNames?.reduce<{
    [key: string]:
      | ((...fnParams: unknown[]) => void)
      | ((newFormData: Record<string, unknown>) => void)
      | Record<string, unknown>
      | undefined
    onChangeFormData?: (newFormData: Record<string, unknown>) => void
  }>((acc, currentEventName: string) => {
    const eventProps = getEventActionIdsByEventName(currentEventName)

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
  const elementModel =
    isComponentType(element.element_type) &&
    ELEMENT_MODELS?.find((model) => model.type === element.element_type)
  if (
    elementModel &&
    'renderType' in elementModel &&
    elementModel.renderType === 'form'
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
