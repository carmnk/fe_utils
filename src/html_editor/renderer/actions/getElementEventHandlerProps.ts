import {
  AppController,
  EditorStateType,
  Element,
  Property,
} from '../../editorRendererController'
import { isComponentType } from '../utils'
import { createAppAction } from './createAppAction'
import { htmlEventCategories } from './htmlElementEvents'
import { NavigateFunction } from 'react-router-dom'

export type GetElementEventHandlersParams = {
  element: Element
  editorState: EditorStateType
  appController: AppController
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  COMPONENT_MODELS: any
  icons: any
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
      const componentEvents = (element as any)
        ?.formGen?.({
          editorState,
          appController,
          currentViewportElements,
          selectedPageElements,
        })
        ?.fields?.filter((field: any) => field._prop_type === 'eventHandler')
      return componentEvents?.map((ev: any) => ev.name)
    } else {
      return htmlEventCategories
        .map((category) => {
          return category.eventNames
        })
        .flat()
    }
  })()
  const eventHandlerProps = componentEventNames?.reduce(
    (acc: any, currentEventName: string) => {
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
              isDev: !isProduction,
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
                isDev: !isProduction,
              })
            },
      }
    },
    {}
  )
  return eventHandlerProps
}
