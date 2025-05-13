import {
  EditorRendererControllerType,
  EditorStateType,
  Element,
} from '../../editorRendererController'
import { replacePlaceholdersInString } from '../placeholder/replacePlaceholder'
import { queryAction } from './queryAction'
import { toast } from 'react-hot-toast'

type EditorRendererController = EditorRendererControllerType

export const createAppAction = (params: {
  element: Element
  eventName: string
  editorState: EditorStateType
  currentViewportElements: EditorRendererController['currentViewportElements']
  ELEMENT_MODELS: EditorRendererController['ELEMENT_MODELS']
  appController: EditorRendererController['appController']
  icons?: Record<string, string>
  navigate: (to: string) => void
  isProduction?: boolean
  // formData?: Record<string, any>
}): ((...fnParams: unknown[]) => Promise<void>) | undefined => {
  const {
    element,
    editorState,
    currentViewportElements,
    ELEMENT_MODELS,
    appController,
    eventName,
    icons,
    navigate,
    isProduction,
    // formData,
  } = params

  const elementProps = editorState.properties?.filter(
    (prop) => prop.element_id === element.element_id
  )
  const templateProps = editorState.properties?.filter(
    (prop) =>
      prop.template_id === element.template_id &&
      !elementProps.find((elprop) => elprop.prop_name === prop.prop_name)
  )

  const allElementProps = [...(elementProps ?? []), ...(templateProps ?? [])]
  const getPropActionIdsByName = (key: string) =>
    allElementProps?.find((prop) => prop.prop_name === key)?.action_ids ?? []
  const actionIds = getPropActionIdsByName(eventName)
  // const eventProps = getPropByName(eventName) as string[]
  return !actionIds?.length
    ? undefined
    : async (...fnParams: unknown[]) => {
        console.debug('app action called', eventName, fnParams)
        // click actions are currently assosiacted with endpoint events only!
        // const actionIds: string[] = eventProps

        const navigationActionElements = actionIds
          .map(
            (actId) =>
              currentViewportElements.find((el) => el.element_id === actId) ??
              null
          )
          .filter((el) => el)
        const navigationActionElementIds = navigationActionElements.map(
          (el) => el?.element_id
        ) as string[]

        for (let a = 0; a < actionIds.length; a++) {
          const actionId = actionIds[a]
          const endpointAction = editorState.actions.find(
            (act) => act.action_id === actionId
          )
          const navigationAction = navigationActionElementIds.includes(actionId)
          const action = editorState.actions.find(
            (act) => act.action_id === actionId
          )
          const isPageNavigation =
            action?.internal_action_name === 'navigatePage'
          if (!endpointAction && !navigationAction && !isPageNavigation) {
            console.warn(
              'No ep and no nav -action found for actionId',
              actionId
            )
            continue
          }
          if (isPageNavigation) {
            const actionsParmValue = editorState.action_params.find(
              (ap) =>
                ap.param_name === 'navigatePage' &&
                ap.element_id === element.element_id &&
                actionId === ap.action_id
            )?.param_value
            if (isProduction) {
              console.debug('Navigate to page ...', isProduction)
              navigate('/' + actionsParmValue)
            } else {
              console.warn(
                'Navigate to page not implemented in dev mode, will navigate to ' +
                  actionsParmValue
              )
              toast.error(
                'Navigate to page not implemented in dev mode, navigate to ' +
                  actionsParmValue
              )
            }
            continue
          } else if (endpointAction) {
            const endpointId = endpointAction.endpoint_id
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
            const url = (api?.base_url || '') + (endpoint?.url || '')
            const action = editorState.actions.find(
              (act) => act.endpoint_id === endpoint?.endpoint_id
            )
            const elementTemplateValuesDict = editorState.action_params
              .filter((ap) => ap.element_id === element.element_id)
              .reduce<Record<string, string>>((acc, cur) => {
                return {
                  ...acc,
                  [cur.param_name]: cur.param_value,
                }
              }, {})
            const componentModel = ELEMENT_MODELS.find(
              (mod) => mod.type === element.element_type
            )
            const isItemEvent =
              componentModel?.schema?.properties[eventName]?.eventType

            const elementTemplateValuesDictAdj = isItemEvent
              ? Object.keys(elementTemplateValuesDict).reduce<
                  Record<string, string>
                >((acc, cur) => {
                  const value =
                    elementTemplateValuesDict?.[
                      cur as keyof typeof elementTemplateValuesDict
                    ]
                  const replaceValue = fnParams?.[1] as string
                  const newValue =
                    typeof value === 'string' &&
                    ['string', 'number'].includes(typeof replaceValue)
                      ? value?.replaceAll?.('{itemId}', replaceValue)
                      : value
                  const matches =
                    typeof newValue === 'string' &&
                    newValue?.match?.(
                      /{(_data|form|formData|props|treeviews|buttonStates)\.[^}]*}/g
                    )
                  const newValueReplaced = matches
                    ? replacePlaceholdersInString(
                        newValue,
                        appController.state,
                        editorState.composite_component_props,
                        editorState.properties,
                        element,
                        undefined,
                        undefined,
                        icons,
                        undefined,
                        componentModel?.renderType === 'form'
                          ? (fnParams?.[1] as Record<string, unknown>)
                          : undefined
                      )
                    : newValue
                  const regexOnlyNumbersOrDecimal = /^[0-9]+(\.[0-9]+)?$/
                  const isNumberOrDecimal =
                    regexOnlyNumbersOrDecimal.test(newValueReplaced)
                  const newValueAdj = isNumberOrDecimal
                    ? parseFloat(newValueReplaced)
                    : newValueReplaced
                  return {
                    ...acc,
                    [cur]: newValueAdj,
                  }
                }, {})
              : elementTemplateValuesDict
            console.debug(
              'elementTemplateValuesDictAdj',
              elementTemplateValuesDictAdj,
              isItemEvent,
              ['string', 'number'].includes(typeof fnParams?.[1]),
              fnParams,
              elementTemplateValuesDict
            )

            await queryAction(
              appController,
              action?.action_id ?? '', // should never happen -> should always have action
              endpoint?.method as string,
              url,
              !!endpoint?.use_cookies,
              endpoint?.body,
              endpoint?.headers,
              endpoint?.params,
              endpoint?.response_type,
              undefined,
              elementTemplateValuesDictAdj
            )
          } else if (navigationAction) {
            const navElementId = actionId
            const actionParam = editorState.action_params.find(
              (ap) => ap.param_name === navElementId
            )
            const elementWithEvent = actionParam?.element_id
            if (!elementWithEvent) return

            appController.actions.updateProperty(
              navElementId,
              actionParam.param_value
            )
          }
        }
      }
}
