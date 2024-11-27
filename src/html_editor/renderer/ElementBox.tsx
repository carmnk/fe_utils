import { useMemo, useRef, FC } from 'react'
import { CSSProperties, PropsWithChildren, MouseEvent } from 'react'
import { EditorStateType, Element } from '../editorRendererController/types'
import { Box } from '@mui/material'
import { getStylesFromClasses } from './classes/getStylesFromClasses'
import { EditorRendererControllerType } from '../editorRendererController/types/editorRendererController'
import { ComponentBox } from './ComponentBox'
import { replacePlaceholdersInString } from './placeholder/replacePlaceholder'
import { NavigateFunction } from 'react-router-dom'

const regexAnyPlaceholder = /{(.*?)}/

export type ElementBoxProps = {
  element: Element
  editorState: EditorStateType
  appController: EditorRendererControllerType['appController']
  currentViewportElements: Element[]
  selectedPageElements: Element[]
  COMPONENT_MODELS: EditorRendererControllerType['COMPONENT_MODELS']
  selectedElement: Element | null
  uiActions?: unknown
  //
  onSelectElement: (element: Element, isHovering: boolean) => void
  isProduction?: boolean
  isPointerProduction?: boolean
  OverlayComponent?: FC<{ element: Element }>
  navigate: NavigateFunction
  events: { [key: string]: ((...fnParams: unknown[]) => void) | undefined }
  rootCompositeElementId?: string
}

const sx = {
  position: 'relative',
}

export const ElementBox = (props: PropsWithChildren<ElementBoxProps>) => {
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
    uiActions,
    OverlayComponent,
    navigate,
    events,
    rootCompositeElementId,
  } = props

  const isOverheadHtmlElement = ['html', 'head', 'body'].includes(element._type)
  const elementRef = useRef<HTMLDivElement>(null)

  const elementAttributsDict = useMemo(
    () =>
      editorState.attributes
        .filter((attr) => {
          // while (element?._type !== 'composite') {
          return attr.element_id === element._id && element?._id
        })
        .reduce<Record<string, string | Record<string, string>>>(
          (acc, attr) => {
            const key = attr.attr_name
            // if (key === 'style') {
            //   return acc
            // }
            const valueRaw = attr.attr_value
            const value =
              typeof valueRaw === 'string' &&
              valueRaw.match(regexAnyPlaceholder)
                ? replacePlaceholdersInString(
                    valueRaw,
                    appController.state,
                    editorState.compositeComponentProps,
                    editorState.properties,
                    editorState.attributes,
                    element,
                    element?._id,
                    rootCompositeElementId,
                    undefined,
                    undefined // icons
                  )
                : valueRaw &&
                    typeof valueRaw === 'object' &&
                    !Array.isArray(valueRaw) &&
                    Object.keys(valueRaw).length > 0
                  ? Object.keys(valueRaw).reduce((acc, key) => {
                      const valueRawSingle = valueRaw[
                        key as keyof typeof valueRaw
                      ] as string
                      const valueSingle =
                        typeof valueRawSingle === 'string' &&
                        valueRawSingle.match(regexAnyPlaceholder)
                          ? replacePlaceholdersInString(
                              valueRawSingle,
                              appController.state,
                              editorState.compositeComponentProps,
                              editorState.properties,
                              editorState.attributes,
                              element,
                              element?._id,
                              rootCompositeElementId,
                              undefined,
                              undefined // icons
                            )
                          : valueRawSingle

                      return {
                        ...acc,
                        [key]:
                          typeof valueSingle === 'string'
                            ? valueSingle
                            : valueSingle?.toString(),
                      }
                    }, {})
                  : valueRaw

            return {
              ...acc,
              [key]: key !== 'style' ? value.toString() : value, // react-html attributes must be strings (in contrast to react 'elements')
            }
          },
          {}
        ),
    [
      editorState.attributes,
      element,
      appController.state,
      editorState.compositeComponentProps,
      editorState.properties,
      rootCompositeElementId,
    ]
  )
  if (
    element?._type === 'composite' ||
    element?._type === 'svg' ||
    element?._type === 'polygon' ||
    element?.component_id
  ) {
    console.debug(
      'elementAttributsDict',
      element._id,
      element?._type,
      element?.component_id,
      elementAttributsDict,
      editorState.attributes.filter(
        (attr) =>
          (attr.element_id === element._id && element?._id) ||
          (attr.component_id === element.component_id && element.component_id)
      ),
      'attrsRaw',
      editorState.attributes.filter((attr) => {
        return (
          attr.element_id === element._id &&
          element?._id &&
          attr.attr_name === 'style'
        )
      }),
      'children',
      children
    )
  }
  const className = elementAttributsDict?.className as string

  const stylesFromClasses = useMemo(
    () => getStylesFromClasses(className ?? '', editorState?.cssSelectors),
    [className, editorState?.cssSelectors]
  )

  const bgImageFile = useMemo(() => {
    const styleAttributes = elementAttributsDict?.style as CSSProperties
    return styleAttributes && styleAttributes?.backgroundImage
      ? (editorState.assets.images.find(
          (img) => img._id === styleAttributes.backgroundImage && img.image
        )?.image as unknown as File)
      : undefined
  }, [elementAttributsDict, editorState.assets.images])

  const bgImgSrcValue = useMemo(() => {
    const source = bgImageFile ? URL.createObjectURL(bgImageFile) : undefined
    return source ? `url('${source}')` : undefined
  }, [bgImageFile])

  const styles = useMemo(() => {
    const linkHoverStyles =
      element._type === 'a' && elementAttributsDict?.href
        ? { cursor: 'pointer' }
        : {}
    const bgImageStyles = bgImgSrcValue
      ? { backgroundImage: bgImgSrcValue }
      : {}
    const styleAttributes =
      'style' in elementAttributsDict
        ? ((elementAttributsDict?.style as CSSProperties) ?? {})
        : {}

    const aggregatedUserStylesRaw: CSSProperties = {
      ...stylesFromClasses,
      ...styleAttributes,
    }
    const aggregatedUserStyles: CSSProperties = Object.keys(
      aggregatedUserStylesRaw
    ).reduce((acc, key) => {
      const valueRaw = aggregatedUserStylesRaw[key as keyof CSSProperties]
      const value =
        typeof valueRaw === 'string' && valueRaw.match(regexAnyPlaceholder)
          ? (replacePlaceholdersInString(
              valueRaw,
              appController.state,
              editorState.compositeComponentProps,
              editorState.properties,
              editorState.attributes,
              element,
              element?._id,
              rootCompositeElementId,
              undefined,
              undefined // icons
            ) as string)
          : valueRaw
      if (value) {
        return { ...acc, [key]: value }
      }
      return acc
    }, {})
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
      ...aggregatedUserStyles,
      ...bgImageStyles,
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
    bgImgSrcValue,
    appController.state,
    editorState.compositeComponentProps,
    editorState.properties,
    // selectedElement,
    editorState.attributes,
    rootCompositeElementId,
  ])

  const linkProps = useMemo(() => {
    if (element._type === 'a') {
      return {
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          e.preventDefault()
          const href = elementAttributsDict?.href as string
          const isExternalLink = !href?.startsWith('/')
          if (isExternalLink) {
            window.open(href, '_blank')
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      style: _s,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      href: _h,
      ...styleLessAttributes
    } = elementAttributsDict ?? {}
    return {
      component: isOverheadHtmlElement
        ? ('div' as const)
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (element._type as any),
      key: element._id,
      ...(styleLessAttributes ?? {}),
      sx: styles,
      ...linkProps,
    }
  }, [element, isOverheadHtmlElement, styles, elementAttributsDict, linkProps])

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
      uiActions={uiActions}
      isProduction={!!isProduction}
      OverlayComponent={OverlayComponent}
      navigate={navigate}
      rootCompositeElementId={rootCompositeElementId}
    />
  ) : ['br', 'hr', 'img'].includes(element?._type) ? ( // null
    <Box
      {...boxProps}
      src={imageSrc}
      ref={elementRef}
      key={element._id}
      {...events}
    />
  ) : (
    <Box {...boxProps} ref={elementRef} key={element._id} {...events}>
      {/* label / flag */}
      {!isProduction && !isPointerProduction && (
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
      )}

      {('_content' in element ? element?._content : children) || children}
    </Box>
  )
}
