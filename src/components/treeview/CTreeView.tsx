import {
  SimpleTreeView,
  SimpleTreeViewProps,
} from '@mui/x-tree-view/SimpleTreeView'
import Icon from '@mdi/react'
import { StyledTreeItem, StyledTreeItemProps } from './CTreeItem'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'
import type { PointerEvent, ReactNode } from 'react'

const dblTouchTapMaxDelay = 400
let latestTouchTap = {
  time: 0,
  target: null,
}

const isDblTouchTap = (event: any) => {
  const touchTap = {
    time: new Date().getTime(),
    target: event.currentTarget,
  }
  const isFastDblTouchTap =
    touchTap.target === latestTouchTap.target &&
    touchTap.time - latestTouchTap.time < dblTouchTapMaxDelay
  latestTouchTap = touchTap
  return isFastDblTouchTap
}

function snapToGrid(args: {
  transform: { x: number; y: number; scaleX: number; scaleY: number }
}) {
  const { transform } = args

  return {
    ...transform,
    // x: Math.ceil(transform.x / gridSize) * gridSize,
    y: Math.abs(transform.y) < 7 ? 0 : transform.y,
  }
}
// const modifiers = [snapToGrid]
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
  disableExpandMargin?: boolean,
  expandAllChildren?: (id: string) => void,
  collapseAllChildren?: (id: string) => void,
  toggleSelect?: (id: string) => void,
  borderDraggin?: {
    topBorderDragging: { id: string } | null
    bottomBorderDragging: { id: string } | null
  }
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

      const { children: childrenProps, ...props } = item as any
      const children = (childrenProps ?? []) as StyledTreeItemProps[]

      const disableBeforeAfterInsertion =
        (!item._parentId &&
          !(item as any)?.component_id &&
          !(item as any)?.template_id) ||
        (item as any).type === 'component'

      return (
        <StyledTreeItem
          {...props}
          sx={{
            ...props?.sx,
            borderTop:
              borderDraggin?.topBorderDragging?.id === item.nodeId &&
              !disableBeforeAfterInsertion
                ? '2px solid red !important'
                : undefined,
            borderBottom:
              borderDraggin?.bottomBorderDragging?.id === item.nodeId &&
              !disableBeforeAfterInsertion
                ? '2px solid red'
                : undefined,
          }}
          key={item.nodeId}
          labelIcon={
            typeof labelIcon === 'string' ? (
              <Icon path={labelIcon} size={1} />
            ) : (
              labelIcon
            )
          }
          disableBorderLeft={disableBorderLeft}
          additionalActions={item?.additionalActions ?? additionalActions}
          actions={item?.actions ?? actions}
          toggleExpand={toggleExpand}
          disableExpandMargin={disableExpandMargin}
          expandAllChildren={expandAllChildren}
          collapseAllChildren={collapseAllChildren}
          toggleSelect={toggleSelect}
        >
          {((!!children?.length &&
            recursiveMap(
              children,
              events,
              undefined,
              toggleExpand,
              item.nodeId as any,
              undefined,
              expandAllChildren,
              collapseAllChildren,
              toggleSelect,
              borderDraggin
            )) as ReactNode) || undefined}
        </StyledTreeItem>
      )
    }) ?? null
  )
}

export type AdditionalActionType = {
  action: (nodeId: string | number, e: any, sourceAnchorEl: HTMLElement) => void
  icon: string
  tooltip: string
  label: string
  disabled?: boolean
  disableStopPropagation?: boolean
  useDragListeners?: boolean
}

export type AdditionalActionGenType =
  | AdditionalActionType[]
  | ((item: any) => AdditionalActionType[])

export type CTreeViewProps = Omit<
  SimpleTreeViewProps<false>,
  'selectedItems'
> & {
  items: StyledTreeItemProps[]
  actions?: AdditionalActionGenType
  additionalActions?: AdditionalActionGenType
  onToggleExpand?: (id: string) => void
  onExpandChildrenRecursively?: (id: string) => void
  onCollapseChildrenRecursively?: (id: string) => void
  onNodeDoubleClick?: (id: string, e: any) => void
  onToggleSelect?: (id: string, e?: any) => void
  onDragDrop?: (
    event: any,
    draggedItem: any,
    droppedItem: any,
    droppedOnBorder?: 'top' | 'bottom'
  ) => void // nodeId is the id of the dropped item
  onDragging?: (event: any, active: boolean, draggedItem: any) => void
  expandedItems?: string[]
  selectedItems?: string[]
  maxWidth?: number
  disableItemsFocusable?: boolean
  width?: number
  onChangeDraggingActive?: (active: boolean) => void
  onMouseUp?: any
  disableExpandMargin?: boolean
  transformer?: any[]
}

export const CTreeView = (props: CTreeViewProps) => {
  const {
    items,
    onExpandedItemsChange,
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
    onChangeDraggingActive,
    disableExpandMargin,
    onNodeDoubleClick,
    transformer,
    onExpandChildrenRecursively,
    onCollapseChildrenRecursively,
    sx,
    ...rest
  } = props

  const [ui, setUi] = useState<{
    dragging: {
      ctrKeyDown: boolean
      active: boolean
      draggedItemId: string | null
    }
    topBorderDragging: { id: string } | null
    bottomBorderDragging: { id: string } | null
  }>({
    dragging: { ctrKeyDown: false, active: false, draggedItemId: null },
    topBorderDragging: null,
    bottomBorderDragging: null,
  })

  const [overlay, setOverlay] = useState<any>(null)
  const treeViewRef = useRef<any>(null)

  const handleDragStart = useCallback((event: any) => {
    // console.log('START DRAGGIN 123')
    const treeItemProps = event?.active?.data?.current
    const draggedItemId = event?.active?.id

    setOverlay(treeItemProps)
    setUi((current) => ({
      ...current,
      dragging: { ...current?.dragging, active: true, draggedItemId },
    }))
  }, [])

  const handleDragEnd = useCallback(
    (event: any) => {
      const overItem = event?.over?.data?.current
      if (!overItem || !overlay) return

      const isTopBorderDragged =
        (event.activatorEvent as PointerEvent).clientY + event.delta.y <
          event.over.rect.top + 8 &&
        (event.activatorEvent as PointerEvent).clientY + event.delta.y >
          (event?.over?.rect?.top ?? 0) - 8
      const isBottomBorderDragged =
        (event.activatorEvent as PointerEvent).clientY + event.delta.y <
          event.over.rect.bottom + 8 &&
        (event.activatorEvent as PointerEvent).clientY + event.delta.y >
          (event?.over?.rect?.bottom ?? 0) - 8

      onDragDrop?.(
        event,
        overlay,
        overItem,
        isTopBorderDragged
          ? 'top'
          : isBottomBorderDragged
          ? 'bottom'
          : undefined
      )
      setOverlay(null)
      setUi((current) => ({
        ...current,
        dragging: { ctrKeyDown: false, active: false, draggedItemId: null },
        bottomBorderDragging: null,
        topBorderDragging: null,
      }))
      onDragging?.(event, false, overlay)
      lastMouseMoveEvent.current = null
    },
    [onDragDrop, overlay, onDragging]
  )

  const lastMouseMoveEvent = useRef<any>(null)
  useEffect(() => {
    const mouseMoveListener = debounce((e: any) => {
      // console.log('MOUSE MVOE ', ui.dragging)
      if (!ui.dragging.active) {
        return
      }
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
    }, 100)

    const keyDownListener = (e: any) => {
      console.log('KEYDOWN LISTENER IS TRIGGERED ')
      const ctrlKey = e?.ctrlKey

      if (e?.repeat || ctrlKey === lastMouseMoveEvent.current?.ctrlKey) {
        return
      }

      const newEvent = { ...(lastMouseMoveEvent.current ?? {}), ctrlKey }

      let isCtrlStatuschanged
      setUi((current) => {
        isCtrlStatuschanged = ctrlKey !== current?.dragging?.ctrKeyDown
        return isCtrlStatuschanged
          ? {
              ...current,
              dragging: { ...current.dragging, ctrKeyDown: ctrlKey },
            }
          : current
      })
      if (isCtrlStatuschanged) {
        onDragging?.(newEvent, true, overlay) // event handler is not addded if dragging is not active
      }
    }
    const keyUpListener = (e: any) => {
      console.log('KEYUP LISTENER IS TRIGGERED ')
      if (e?.repeat) {
        return
      }
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
    const treeView = treeViewRef.current

    treeView.addEventListener('keydown', keyDownListener)
    treeView.addEventListener('keyup', keyUpListener)
    treeView.addEventListener('pointermove', mouseMoveListener)

    return () => {
      treeView.addEventListener('keydown', keyDownListener)
      treeView.addEventListener('keyup', keyUpListener)
      treeView.removeEventListener('pointermove', mouseMoveListener)
    }
    /// no need to update the listeners
    /// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.dragging?.active])

  // const handleExpandNode = useCallback(
  //   (e: MouseEvent, ids: string[]) => {
  //     if (!onToggleExpand) return
  //     onToggleExpand(ids)
  //   },
  //   [onToggleExpand]
  // )

  const handleNodeSelect = useCallback(
    (e: any, value: any) => {
      const isDoubleTap = isDblTouchTap(e)
      // console.info('onSelect', isDoubleTap)
      if (onNodeDoubleClick && isDoubleTap) {
        onNodeDoubleClick?.(value, e)
        return
      }
      if (!onToggleSelect) return
      if (selectedItems?.[0] === value) {
        onToggleSelect(null as any, e)
        return
      }
      onToggleSelect?.(value, e)
      // treeViewRef.current.focus()
    },
    [onToggleSelect, selectedItems, onNodeDoubleClick]
  )

  const selected = useMemo(() => selectedItems?.[0], [selectedItems])
  useEffect(() => {
    if (selected === null) {
      const focusedItem = treeViewRef.current?.querySelector(
        '.MuiTreeItem-content.Mui-focused'
      )
      if (focusedItem) {
        focusedItem.classList.remove('Mui-focused')
      }
    }
  }, [selected])

  const treeViewSx = useMemo(() => {
    return {
      overflowY: 'auto',
      maxWidth: maxWidth,
      width,
      ...(treeViewProps as any),
      ...sx,
      touchAction: overlay ? 'none' : undefined,
    }
  }, [maxWidth, width, sx, overlay])

  const modifiers = useMemo(() => {
    return [snapToGrid, restrictToVerticalAxis, ...(transformer ?? [])]
  }, [transformer])

  const handleToggleExpand = useCallback(
    (newValue: string) => {
      onToggleExpand?.(newValue)
      // console.info('onToggleExpand', newValue)
      // const newToggles = [
      //   ...(expandedItems?.filter((item) => item !== newValue) ?? []),
      //   newValue,
      // ]
      // onToggleExpand?.(null as any, newToggles)
    },
    [onToggleExpand]
  )

  const testExpandedChanged = useCallback((_e: any, newValues: string[]) => {
    // console.info('onExpandedItemsChange', newValues)
  }, [])

  const handleDragMove = useCallback(
    (event: any) => {
      const overItem = event?.over?.data?.current
      // const overNodeId = overItem?.nodeId

      if (!overItem || !overlay) return

      if (!event?.over?.rect) {
        return
      }
      const isTopBorderDragged =
        (event.activatorEvent as PointerEvent).clientY + event.delta.y <
          event.over.rect.top + 8 &&
        (event.activatorEvent as PointerEvent).clientY + event.delta.y >
          (event?.over?.rect?.top ?? 0) - 8
      const isBottomBorderDragged =
        (event.activatorEvent as PointerEvent).clientY + event.delta.y <
          event.over.rect.bottom + 8 &&
        (event.activatorEvent as PointerEvent).clientY + event.delta.y >
          (event?.over?.rect?.bottom ?? 0) - 8
      // if (isTopBorderDragged || isBottomBorderDragged) {
      setUi((current) => ({
        ...current,
        topBorderDragging: isTopBorderDragged ? { id: event.over.id } : null,
        bottomBorderDragging: isBottomBorderDragged
          ? { id: event.over.id }
          : null,
      }))
    },
    [overlay]
  )

  const handleDragAbort = useCallback((e: any) => {
    console.log('handleDragAbort', e)
  }, [])
  const handleDragCancel = useCallback((e: any) => {
    console.log('handleDragCancel', e)
  }, [])
  const handlePointerUp = useCallback((e: any) => {
    setOverlay(null)
  }, [])

  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={modifiers}
        onDragMove={handleDragMove}
        onDragAbort={handleDragAbort}
        onDragCancel={handleDragCancel}
      >
        <SimpleTreeView
          {...rest}
          ref={treeViewRef}
          disabledItemsFocusable={disableItemsFocusable}
          aria-label="tree-view"
          expandedItems={expandedItems as any}
          onSelectedItemsChange={handleNodeSelect}
          onExpandedItemsChange={testExpandedChanged}
          selectedItems={selectedItems?.[0] ?? ''}
          sx={treeViewSx}
          onPointerUp={handlePointerUp}
        >
          {items?.map?.((item) =>
            recursiveMap(
              [item],
              {
                additionalActions: additionalActions,
                actions,
              },
              true,
              handleToggleExpand,
              undefined,
              disableExpandMargin,
              onExpandChildrenRecursively,
              onCollapseChildrenRecursively,
              onToggleSelect,
              {
                topBorderDragging: ui.topBorderDragging,
                bottomBorderDragging: ui.bottomBorderDragging,
              }
            )
          )}
        </SimpleTreeView>

        <DragOverlay modifiers={modifiers}>
          {overlay && (
            <SimpleTreeView>
              <StyledTreeItem key="overlay" {...overlay} />
            </SimpleTreeView>
          )}
        </DragOverlay>
      </DndContext>
    </>
  )
}
