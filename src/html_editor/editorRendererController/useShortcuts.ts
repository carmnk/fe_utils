import { useMemo, useCallback } from 'react'
import { getStylesFromClasses } from '../renderer/classes/getStylesFromClasses'
import { getInitialStyles } from '../utils'
import { EditorStateType, Element } from './types'
import { baseComponents } from '../editorComponents/baseComponents'

const getRecursiveChildren = (
  allElements: Element[],
  parentId: string
): Element[] => {
  const children = allElements.filter((el) => el._parentId === parentId)
  return (children as any)
    .map((child: any) =>
      child._id
        ? [child, ...getRecursiveChildren(allElements, child._id)]
        : null
    )
    .filter((val: any) => val)
    .flat()
}

export const useShortcuts = (params: {
  editorState: EditorStateType
  customComponents?: any[]
}) => {
  const { editorState, customComponents } = params

  const currentViewportElements = useMemo(() => {
    const currentViewport = editorState.ui.selected.viewport
    const currentViewportElements =
      currentViewport === 'xs'
        ? editorState.elements
        : editorState.alternativeViewports[currentViewport]
    if (currentViewport === 'xs') return editorState.elements
    return currentViewportElements?.length
      ? currentViewportElements
      : editorState.elements
  }, [
    editorState.elements,
    editorState.alternativeViewports,
    editorState.ui.selected.viewport,
  ])

  const selectedElement = useMemo(() => {
    const id = editorState?.ui.selected.element
    return currentViewportElements?.find((el) => el._id === id && id) ?? null
  }, [editorState.ui.selected.element, currentViewportElements])

  const selectedPageElements = useMemo(() => {
    const selectedPage = editorState.ui.selected.page
    return (
      currentViewportElements?.filter((el) => el._page === selectedPage) ?? []
    )
  }, [editorState.ui.selected.page, currentViewportElements])

  const getStyleAttributesDictByElementId = useCallback(
    (elementId: string) => {
      const elementAttributes = editorState.attributes.filter(
        (attr) => attr.element_id === elementId
      )
      const elementAttributesDict = elementAttributes.reduce<
        Record<string, any>
      >((acc, attr) => {
        return {
          ...acc,
          [attr.attr_name]: attr.attr_value,
        }
      }, {})
      return {
        ...getInitialStyles(),
        // ...getStylesFromClasses(className ?? '', editorState?.cssSelectors),
        ...(elementAttributesDict?.style ?? {}),
      }
    },
    [editorState.attributes]
  )

  const selectedElementStyleAttributes = useMemo(() => {
    const elementAttributes = editorState.attributes.filter(
      (attr) => attr.element_id === editorState.ui.selected.element
    )
    const elementAttributesDict = elementAttributes.reduce<Record<string, any>>(
      (acc, attr) => {
        return {
          ...acc,
          [attr.attr_name]: attr.attr_value,
        }
      },
      {}
    )
    const className = elementAttributesDict?.className
    return {
      ...getInitialStyles(),
      ...getStylesFromClasses(className ?? '', editorState?.cssSelectors),
      ...(elementAttributesDict?.style ?? {}),
    }
  }, [
    editorState.cssSelectors,
    editorState.ui.selected.element,
    editorState.attributes,
  ])

  const getSelectedImage = useCallback(
    (imageId?: string) => {
      const selectedImageId = imageId ?? editorState.ui.selected.image
      const selectedImage =
        editorState.assets.images.find(
          (image) => image._id === selectedImageId
        ) ?? null
      return { ...selectedImage, imageSrcId: imageId ?? '' } as any
    },
    [editorState?.assets.images, editorState.ui.selected.image]
  )

  const COMPONENT_MODELS = useMemo(
    () => [...baseComponents, ...(customComponents ?? [])],
    [customComponents]
  )
  return {
    currentViewportElements,
    selectedElement,
    selectedPageElements,
    selectedElementStyleAttributes,
    getSelectedImage,
    COMPONENT_MODELS,
    getRecursiveChildren,
    getStyleAttributesDictByElementId,
  }
}
