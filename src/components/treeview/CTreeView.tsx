/* eslint-disable @typescript-eslint/no-explicit-any */

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import Icon from '@mdi/react'
import { StyledTreeItem, StyledTreeItemProps } from './CTreeItem'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useState, useRef, useCallback, useEffect, ReactNode } from 'react'

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string
    '--tree-view-bg-color'?: string
  }
}
const treeViewProps = {
  WebkitUserSelect: 'none' /* Safari */,
  MozUserSelect: 'none' /* Firefox */,
  MsUserSelect: 'none' /* IE10+/Edge */,
  userSelect: 'none' /* Standard */,
}

const recursiveMap = (
  items: StyledTreeItemProps[],
  events: {
    additionalActions?:
      | AdditionalActionType[]
      | ((item: any) => AdditionalActionType[])
    actions?: AdditionalActionType[] | ((item: any) => AdditionalActionType[])
  },
  disableBorderLeft?: boolean,
  toggleExpand?: (id: string) => void,
  parentId?: string,
  onToggleSelect?: (id: string, e?: any) => void
): ReactNode[] => {
  const relevantElements = parentId
    ? items?.filter((el) => el._parentId === parentId)
    : items?.filter((el) => !el._parentId)
  return (
    relevantElements?.map?.(({ labelIcon, ...item }) => {
      const additionalActions =
        typeof events?.additionalActions === 'function'
          ? events?.additionalActions(item)
          : events?.additionalActions
      const actions =
        typeof events?.actions === 'function'
          ? events?.actions(item)
          : events?.actions
      const children = (items?.filter((it) => it._parentId === item.nodeId) ??
        []) as StyledTreeItemProps[]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children: _c, ...props } = item
      return (
        <StyledTreeItem
          onToggleSelect={onToggleSelect}
          key={item.nodeId}
          {...props}
          labelIcon={
            typeof labelIcon === 'string' ? (
              <Icon path={labelIcon} size={1} />
            ) : (
              labelIcon
            )
          }
          disableBorderLeft={disableBorderLeft}
          additionalActions={additionalActions}
          actions={actions}
          toggleExpand={toggleExpand}
        >
          {((!!children?.length &&
            recursiveMap(
              children,
              events,
              undefined,
              toggleExpand,
              item.nodeId as any
            )) as any) || undefined}
        </StyledTreeItem>
      )
    }) ?? null
  )
}

export type AdditionalActionType = {
  action: (nodeId: string | number, e: any) => void
  icon: string
  tooltip: string
  label: string
  disabled?: boolean
}

export type AdditionalActionGenType =
  | AdditionalActionType[]
  | ((item: any) => AdditionalActionType[])

export type CTreeViewProps = {
  items: StyledTreeItemProps[]
  actions?: AdditionalActionGenType
  additionalActions?: AdditionalActionGenType

  selectedItems?: string[]
  onToggleSelect?: (id: string, e: any) => void
  onDragDrop?: (event: any, draggedItem: any, droppedItem: any) => void // nodeId is the id of the dropped item
  onDragging?: (event: any, active: boolean, draggedItem: any) => void
  expandedItems?: string[]
  defaultExpanded?: string[]
  onToggleExpand?: (id: string, e?: any) => void
  enableNullSelection?: boolean
  disableItemsFocusable?: boolean
  maxWidth?: number
  width?: number
}

export const CTreeView = (props: CTreeViewProps) => {
  const {
    items,
    onToggleExpand,
    onToggleSelect,
    expandedItems,
    selectedItems,
    maxWidth = 320,
    additionalActions,
    disableItemsFocusable,
    actions,
    onDragDrop,
    onDragging,
    width,
    enableNullSelection,
    defaultExpanded,
  } = props

  const [ui, setUi] = useState<{
    dragging: { ctrKeyDown: boolean; active: boolean }
  }>({
    dragging: { ctrKeyDown: false, active: false },
  })
  const [overlay, setOverlay] = useState<any>(null)
  const treeViewRef = useRef<any>(null)

  const handleDragStart = useCallback((event: any) => {
    const treeItemProps = event?.active?.data?.current

    setOverlay(treeItemProps)
    setUi((current) => ({
      ...current,
      dragging: { ...current?.dragging, active: true },
    }))
  }, [])
  const handleDragEnd = useCallback(
    (event: any) => {
      const overItem = event?.over?.data?.current
      // const overNodeId = overItem?.nodeId

      if (!overItem || !overlay) return

      onDragDrop?.(event, overlay, overItem)
      setOverlay(null)
      setUi((current) => ({
        ...current,
        dragging: { ctrKeyDown: false, active: false },
      }))
      onDragging?.(event, false, overlay)
      lastMouseMoveEvent.current = null
    },
    [onDragDrop, overlay, onDragging]
  )

  const lastMouseMoveEvent = useRef<any>(null)
  useEffect(() => {
    const mouseMoveListener = (e: any) => {
      lastMouseMoveEvent.current = e
      const isCtrlPressed = e?.ctrlKey
      onDragging?.(e, true, overlay)
      setUi((current) =>
        isCtrlPressed !== current?.dragging?.ctrKeyDown
          ? {
              ...current,
              dragging: { ...current.dragging, ctrKeyDown: isCtrlPressed },
            }
          : current
      )
    }
    const keyDownListener = (e: any) => {
      const ctrlKey = e?.ctrlKey
      const newEvent = { ...(lastMouseMoveEvent.current ?? {}), ctrlKey }
      onDragging?.(newEvent, true, overlay) // event handler is not addded if dragging is not active
      setUi((current) =>
        ctrlKey !== current?.dragging?.ctrKeyDown
          ? {
              ...current,
              dragging: { ...current.dragging, ctrKeyDown: ctrlKey },
            }
          : current
      )
    }
    const keyUpListener = (e: any) => {
      const ctrlKey = e?.ctrlKey
      const newEvent = {
        ...(lastMouseMoveEvent.current ?? {}),
        ctrlKey: false,
      }
      onDragging?.(newEvent, true, overlay) // event handler is not addded if dragging is not active
      setUi((current) =>
        ctrlKey !== current?.dragging?.ctrKeyDown
          ? {
              ...current,
              dragging: { ...current.dragging, ctrKeyDown: false },
            }
          : current
      )
    }

    if (ui?.dragging?.active) {
      document.addEventListener('keydown', keyDownListener)
      document.addEventListener('keyup', keyUpListener)
      document.addEventListener('mousemove', mouseMoveListener)
    }
    return () => {
      if (ui?.dragging?.active) {
        document.addEventListener('keydown', keyDownListener)
        document.addEventListener('keyup', keyUpListener)
        document.removeEventListener('mousemove', mouseMoveListener)
      }
    }
  }, [onDragging, overlay, ui?.dragging?.active])

  const handleExpandNode = useCallback(
    (id: string) => {
      if (!onToggleExpand) return
      onToggleExpand(id, null)
    },
    [onToggleExpand]
  )

  const selected = selectedItems?.[0]
  useEffect(() => {
    if (!enableNullSelection) {
      return
    }
    if (selected === null) {
      const focusedItem = treeViewRef.current?.querySelector(
        '.MuiTreeItem-content.Mui-focused'
      )
      if (focusedItem) {
        focusedItem.classList.remove('Mui-focused')
      }
    }
  }, [selected, enableNullSelection])

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // sensors={sensors}
      >
        <SimpleTreeView
          ref={treeViewRef}
          defaultExpandedItems={defaultExpanded}
          disabledItemsFocusable={disableItemsFocusable}
          aria-label="tree-view"
          expandedItems={expandedItems as any}
          onSelectedItemsChange={(e, value) => {
            if (!onToggleSelect) return
            onToggleSelect?.(value as string, e)
            // treeViewRef.current.focus()
          }}
          // onNodeToggle={(e, value) => {
          //   e.stopPropagation();
          //   if (!onToggleExpand) return;
          //   // if ((e?.target as any)?.nodeName !== "svg") return;

          //   const newToggles = [
          //     ...(value.filter((v) => !expandedItems?.includes?.(v)) ?? []),
          //     ...(expandedItems?.filter((item) => !value?.includes?.(item)) ??
          //       []),
          //   ];
          //   forEach(newToggles, (t) => {
          //     onToggleExpand(t, e);
          //   });
          // }}
          selectedItems={selectedItems?.[0]}
          // multiSelect={true}

          sx={{
            overflowY: 'auto',
            maxWidth: maxWidth,
            width,
            ...(treeViewProps as any),
          }}
        >
          {items?.map?.((item) =>
            recursiveMap(
              [item],
              {
                additionalActions: additionalActions,
                actions,
              },
              true,
              handleExpandNode,
              undefined,
              onToggleSelect
            )
          )}
        </SimpleTreeView>

        <DragOverlay modifiers={[restrictToVerticalAxis]}>
          {overlay && <StyledTreeItem key="overlay" {...overlay} />}
        </DragOverlay>
      </DndContext>
    </>
  )
}
