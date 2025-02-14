import { NavContainerComponentPropertys } from '../../componentProperty'
import { Box, useTheme } from '@mui/material'
import { renderElements } from '../../../renderer'
import { PropsWithChildren } from 'react'

export type NavContainerWrapperProps = {
  items: { value: string; childId: string }[]
  navigationElementId: string
}

export const NavContainerWrapper = (
  props: PropsWithChildren<
    NavContainerWrapperProps & NavContainerComponentPropertys
  >
) => {
  const {
    children,
    theme: t_,
    parentId,
    appController,
    isProduction,
    id,
    items,
    navigationElementId,
    editorState,
    currentViewportElements,
    ELEMENT_MODELS,
    OverlayComponent,
    isPointerProduction,
    icons,
    navigate,
    onSelectElement,
    disableOverlay,
    baseComponentId,
    uiActions,
    rootCompositeElementId,
    ...rest
  } = props

  const theme = useTheme()

  const navContainerChildren = (() => {
    const sourceControlElementId = navigationElementId

    if (!sourceControlElementId) return []
    const elementChildren =
      (baseComponentId
        ? editorState.elements
        : currentViewportElements
      )?.filter((el) => el.parent_id === id && id) ?? []

    const sourceControlElement = currentViewportElements?.find(
      (el) => el.element_id === sourceControlElementId
    )
    const activeTab =
      sourceControlElement?.element_type === 'Button'
        ? (appController?.state?.buttonStates?.[
            sourceControlElementId as string
          ] ?? false)
        : appController?.state?.[sourceControlElementId as string]
    const itemsValue = items
    const activeId = (Array.isArray(itemsValue) ? itemsValue : [])?.find(
      (item) => item.value === activeTab
    )?.childId
    const activeChild = elementChildren?.find?.(
      (child) => child.element_id === activeId
    )
    const children = activeChild ? [activeChild] : []

    return children
  })()

  const renderedElementChildren = navContainerChildren?.length
    ? renderElements({
        elements: navContainerChildren,
        editorState,
        appController,
        currentViewportElements,
        ELEMENT_MODELS,
        uiActions,
        onSelectElement,
        theme,
        isProduction,
        icons,
        parentId: id,
        isPointerProduction,
        baseComponentId,
        disableOverlay,
        rootCompositeElementId,
        OverlayComponent,
        navigate,
      })
    : []

  return (
    <Box key={id} {...(rest ?? {})}>
      {renderedElementChildren}
    </Box>
  )
}
