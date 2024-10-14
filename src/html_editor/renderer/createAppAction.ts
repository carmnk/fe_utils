import {
  EditorRendererControllerType,
  EditorStateType,
  Element,
} from '../editorRendererController'
import { replacePlaceholdersInString } from './placeholder/replacePlaceholder'
import { queryAction } from './queryAction'

type EditorRendererController = EditorRendererControllerType<{
  actions: undefined
}>

export const createAppAction = (params: {
  element: Element
  eventName: string
  editorState: EditorStateType
  currentViewportElements: EditorRendererController['currentViewportElements']
  COMPONENT_MODELS: EditorRendererController['COMPONENT_MODELS']
  appController: EditorRendererController['appController']
  icons: any
  // formData?: Record<string, any>
}) => {
  const {
    element,
    editorState,
    currentViewportElements,
    COMPONENT_MODELS,
    appController,
    eventName,
    icons,
    // formData,
  } = params

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

  const eventProps = getPropByName(eventName)
  return async (...fnParams: unknown[]) => {
    // click actions are currently assosiacted with endpoint events only!
    const actionIds: string[] = eventProps

    const navigationActionElements = actionIds
      .map(
        (actId) =>
          currentViewportElements.find((el) => el._id === actId) ?? null
      )
      .filter((el) => el)
    const navigationActionElementIds = navigationActionElements.map(
      (el) => el?._id
    ) as string[]

    for (let a = 0; a < actionIds.length; a++) {
      const actionId = actionIds[a]
      const endpointAction = editorState.actions.find(
        (act) => act.action_id === actionId
      )
      const navigationAction = navigationActionElementIds.includes(actionId)
      if (!endpointAction && !navigationAction) {
        console.warn('No ep and no nav÷ action found for actionId', actionId)
        continue
      }
      if (endpointAction) {
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
        const url = (api?.baseUrl || '') + (endpoint?.url || '')
        const action = editorState.actions.find(
          (act) => act.endpoint_id === endpoint?.endpoint_id
        )
        const elementTemplateValuesDict = editorState.actionParams
          .filter((ap) => ap.element_id === element._id)
          .reduce<Record<string, any>>((acc, cur) => {
            return {
              ...acc,
              [cur.param_name]: cur.param_value,
            }
          }, {})
        const isItemEvent = COMPONENT_MODELS.find(
          (mod) => mod.type === element._type
        )?.schema?.properties[eventName]?.eventType

        const elementTemplateValuesDictAdj = isItemEvent
          ? Object.keys(elementTemplateValuesDict).reduce<Record<string, any>>(
              (acc, cur) => {
                const value =
                  elementTemplateValuesDict?.[
                    cur as keyof typeof elementTemplateValuesDict
                  ]
                const replaceValue = fnParams?.[1] as string
                const newValue = ['string', 'number'].includes(
                  typeof replaceValue
                )
                  ? value?.replaceAll?.('{itemId}', replaceValue)
                  : value
                const matches = newValue?.match?.(
                  /{(_data|form|formData|props|treeviews|buttonStates)\.[^}]*}/g
                )
                if (element._type === 'Form') {
                  console.log(
                    'Before Replace Placeholders with Form element',
                    newValue,
                    element,
                    fnParams,
                    'form passed',
                    element?._type === 'Form'
                      ? (fnParams?.[1] as any)
                      : undefined
                  )
                }
                const newValueReplaced = matches
                  ? replacePlaceholdersInString(
                      newValue,
                      appController.state,
                      editorState.compositeComponentProps,
                      editorState.properties,
                      element as any,
                      undefined,
                      icons,
                      element?._type === 'Form'
                        ? (fnParams?.[1] as any)
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
              },
              {}
            )
          : elementTemplateValuesDict
        console.log(
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
          endpoint?.method,
          url,
          !!endpoint?.useCookies,
          endpoint?.body,
          endpoint?.headers,
          endpoint?.params,
          endpoint?.responseType,
          undefined,
          elementTemplateValuesDictAdj
        )
      } else if (navigationAction) {
        const navElementId = actionId
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
    }
  }
}
