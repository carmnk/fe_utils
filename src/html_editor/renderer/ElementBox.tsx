import { useMemo, useEffect, useRef, FC } from 'react'
import { CSSProperties, PropsWithChildren, MouseEvent } from 'react'
import { EditorStateType, Element } from '../editorRendererController/types'
import { Box } from '@mui/material'
import { getStylesFromClasses } from './classes/getStylesFromClasses'
import { EditorRendererControllerType } from '../editorRendererController/types/editorRendererController'
import { queryAction } from './queryAction'
import { ComponentBox } from './ComponentBox'

export type ElementBoxProps<
  ControllreActionsType extends { [key: string]: any },
> = {
  element: Element
  editorState: EditorStateType
  appController: EditorRendererControllerType<ControllreActionsType>['appController']
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType<ControllreActionsType>['COMPONENT_MODELS']
  selectedElement: Element | null
  actions?: ControllreActionsType
  //
  onSelectElement: (element: Element, isHovering: boolean) => void
  isProduction?: boolean
  isPointerProduction?: boolean
  OverlayComponent?: FC<{
    element: Element
    isProduction?: boolean
    editorState: EditorStateType
    actions?: ControllreActionsType
  }>
  navigate: any
}

const sx = {
  position: 'relative',
}

export const ElementBox = <
  ControllreActionsType extends { [key: string]: any },
>(
  props: PropsWithChildren<ElementBoxProps<ControllreActionsType>>
) => {
  const {
    element,
    children,
    editorState,
    isProduction,
    isPointerProduction,
    appController,
    currentViewportElements,
    selectedPageElements,
    COMPONENT_MODELS,
    selectedElement,
    actions,
    OverlayComponent,
    navigate,
  } = props

  const isOverheadHtmlElement = ['html', 'head', 'body'].includes(element._type)
  const elementRef = useRef<HTMLDivElement>(null)

  const elementAttributsDict = useMemo(
    () =>
      editorState.attributes
        .filter((attr) => attr.element_id === element._id)
        .reduce<Record<string, any>>((acc, attr) => {
          return {
            ...acc,
            [attr.attr_name]: attr.attr_value,
          }
        }, {}),
    [editorState.attributes, element._id]
  )
  const className = elementAttributsDict?.className as string

  const stylesFromClasses = useMemo(
    () => getStylesFromClasses(className ?? '', editorState?.cssSelectors),
    [className, editorState?.cssSelectors]
  )

  const styles = useMemo(() => {
    const linkHoverStyles =
      element._type === 'a' && elementAttributsDict?.href
        ? { cursor: 'pointer' }
        : {}
    const styleAttributes =
      'style' in elementAttributsDict ? (elementAttributsDict?.style ?? {}) : {}

    const aggregatedUserStyles = {
      ...stylesFromClasses,
      ...styleAttributes,
    }
    const userOverridesEditorHoverStyles: CSSProperties = {}
    if ('borderWidth' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderWidth =
        aggregatedUserStyles.borderWidth + ' !important'
    }
    if ('borderStyle' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderStyle =
        aggregatedUserStyles.borderStyle + ' !important'
    }
    if ('borderColor' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderColor =
        aggregatedUserStyles.borderColor + ' !important'
    }
    if ('borderRadius' in aggregatedUserStyles) {
      userOverridesEditorHoverStyles.borderRadius =
        aggregatedUserStyles.borderRadius + ' !important'
    }

    // compensate fixed styles in editor
    // interesting: top=0 -> not default -> inject only if top:0, left:0 is set !! Otherwise the position is as static
    const isPositionFixed =
      !isProduction && aggregatedUserStyles?.position === 'fixed'
    const compensateX =
      isPositionFixed &&
      editorState.ui.previewMode &&
      !aggregatedUserStyles.left
        ? -364
        : isPositionFixed &&
            !editorState.ui.previewMode &&
            aggregatedUserStyles.left
          ? 364
          : 0
    const compensateY = isPositionFixed && aggregatedUserStyles.top ? 42 : 0
    const compensateFixedStylesInEditor = isPositionFixed
      ? { transform: `translate(${compensateX}px, ${compensateY}px)` }
      : {}
    return {
      ...sx,
      ...linkHoverStyles,
      ...stylesFromClasses,
      ...styleAttributes,
      // ...additionalHoverStyles,
      ...userOverridesEditorHoverStyles,
      ...compensateFixedStylesInEditor,
    } as CSSProperties
  }, [
    stylesFromClasses,
    isProduction,
    element,
    editorState.ui.previewMode,
    elementAttributsDict,
  ])

  const linkProps = useMemo(() => {
    if (element._type === 'a') {
      return {
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          e.preventDefault()
          const isExternalLink = !elementAttributsDict?.href?.startsWith('/')
          if (isExternalLink) {
            window.open(elementAttributsDict?.href, '_blank')
          } else {
            const href =
              elementAttributsDict?.href === '/index'
                ? '/'
                : elementAttributsDict?.href
            navigate(href ?? '')
          }
        },
      }
    }
    return {}
  }, [element, navigate, elementAttributsDict])

  const boxProps = useMemo(() => {
    const {
      style: _s,
      href: _h,
      ...styleLessAttributes
    } = elementAttributsDict ?? {}
    return {
      component: isOverheadHtmlElement
        ? ('div' as const)
        : (element._type as any),
      key: element._id,
      ...(styleLessAttributes ?? {}),
      sx: styles,
      ...linkProps,
    }
  }, [element, isOverheadHtmlElement, styles, elementAttributsDict, linkProps])

  useEffect(() => {
    const elementEvents = editorState?.events?.filter(
      (event) => event.element_id === element._id
    )
    if (!elementEvents?.length) {
      return
    }
    const eventHandlers = elementEvents.map((event) => {
      const eventName = event.event_name.slice(2)
      const endpointActions = editorState?.actions?.filter((act) =>
        event?.action_ids?.includes(act.action_id)
      )
      const apiEndpoints = editorState?.externalApis
        ?.map((api) =>
          api.endpoints?.map((ep) => ({ ...ep, api_id: api.external_api_id }))
        )
        .flat()
      const endpoints2 = apiEndpoints.filter((ep) =>
        endpointActions.map((a) => a?.endpoint_id).includes(ep.endpoint_id)
      )

      // only navigation actions
      const eventHandler = async (e: any) => {
        const responses = []
        for (let e = 0; e < endpoints2?.length; e++) {
          const endpoint = endpoints2[e]
          const api = editorState?.externalApis?.find(
            (api) => api.external_api_id === endpoint.api_id
          )
          const url = (api?.baseUrl ?? '') + (endpoint?.url ?? '')
          const doQueryAction = async () => {
            const action = editorState.actions.find(
              (act) => act.endpoint_id === endpoint.endpoint_id
            )
            const elementTemplateValuesDict = editorState.actionParams
              .filter((ap) => ap.element_id === element._id)
              .reduce((acc, cur) => {
                return {
                  ...acc,
                  [cur.param_name]: cur.param_value,
                }
              }, {})
            console.log('QUERY ACTION ', action?.action_id, action)
            return await queryAction(
              appController,
              action?.action_id ?? '', // should never happen -> should always have action
              endpoint?.method,
              url,
              !!endpoint?.useCookies,
              endpoint?.body,
              endpoint?.headers,
              endpoint?.params,
              endpoint?.responseType,
              endpoint?.auth.type === 'basic'
                ? {
                    username: endpoint.auth.username,
                    password: endpoint.auth.password,
                  }
                : undefined,
              elementTemplateValuesDict
            )
          }

          const response = await doQueryAction()
          responses.push(response)
        }
        // only navigation actions
        const navigationActionElementIds = editorState.properties
          .filter((prop) => prop.element_id === element._id)
          .map((prop) =>
            prop?.prop_value && typeof prop.prop_value === 'string'
              ? JSON.parse(prop?.prop_value)
              : prop?.prop_value || []
          )
          .flat()
          .filter((el) => el) as string[]

        for (let n = 0; n < navigationActionElementIds.length; n++) {
          const navElementId = navigationActionElementIds[n]
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

        return responses
      }
      if (!['Unmounted', 'Mounted'].includes(eventName)) {
        elementRef.current?.addEventListener(eventName, eventHandler)
      }
      if (eventName === 'Mounted') {
        eventHandler({ element_id: element._id })
      }
      return eventHandler
    })

    return () => {
      elementEvents.forEach((event, eIdx) => {
        const eventName = event.event_name.slice(2)
        if (!['Unmounted', 'Mounted'].includes(eventName)) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          elementRef.current?.removeEventListener(
            eventName,
            eventHandlers[eIdx]
          )
        }
        if (eventName === 'Unmounted') {
          eventHandlers[eIdx]({ element_id: element._id })
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState?.events])

  const imageFile = useMemo(
    () =>
      element?._type === 'img' && elementAttributsDict?.src
        ? (editorState.assets.images.find(
            (img) => img._id === elementAttributsDict?.src && img.image
          )?.image as unknown as File)
        : undefined,
    [element, elementAttributsDict, editorState.assets.images]
  )
  const prodImageAsset = useMemo(
    () =>
      editorState.assets.images.find(
        (img) => img._id === elementAttributsDict?.src
      ),
    [elementAttributsDict, editorState.assets.images]
  )
  const prodFilenameExtension = prodImageAsset?.fileName?.split('.')?.pop()
  const imageSrc =
    isProduction && !isPointerProduction && elementAttributsDict?.src
      ? // this will only work for gh pages with project in subfolder (rel. to root)!!!
        `/${editorState.project.project_name}/assets/images/${elementAttributsDict?.src}.${prodFilenameExtension}`
      : imageFile
        ? URL.createObjectURL(imageFile)
        : undefined

  return element?._type === 'composite' ? (
    <ComponentBox
      element={element}
      editorState={editorState}
      appController={appController}
      currentViewportElements={currentViewportElements}
      selectedPageElements={selectedPageElements}
      COMPONENT_MODELS={COMPONENT_MODELS}
      selectedElement={selectedElement}
      actions={actions}
      isProduction={!!isProduction}
      OverlayComponent={OverlayComponent}
      navigate={navigate}
    />
  ) : ['br', 'hr', 'img'].includes(element?._type) ? ( // null
    <Box {...boxProps} src={imageSrc} ref={elementRef} />
  ) : (
    <Box {...boxProps} ref={elementRef}>
      {/* label / flag */}
      {!isProduction &&
        !isPointerProduction &&
        ((
          <Box
            sx={{
              display: 'none',
              position: 'absolute',
              top: 0,
              right: 0,
              border: '1px solid rgba(0,150,136,0.5)',
              borderRadius: '1px',
              color: 'text.primary',
            }}
          >
            {element._type}
          </Box>
        ) as any)}

      {('_content' in element ? element?._content : children) || children}
    </Box>
  )
}
