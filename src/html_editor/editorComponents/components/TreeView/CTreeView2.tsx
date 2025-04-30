import {
  SimpleTreeView,
  SimpleTreeViewProps,
} from '@mui/x-tree-view/SimpleTreeView'
import Icon from '@mdi/react'
import { StyledTreeItem, StyledTreeItemProps } from './CTreeItem'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { Box } from '@mui/material'
import { mdiDelete, mdiPlus } from '@mdi/js'
import {
  ReactNode,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react'

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
  parentId: string | null,
  items: StyledTreeItemProps[],
  properties: {
    additionalActions?:
      | AdditionalActionType[]
      | ((item: any) => AdditionalActionType[])
    actions?: AdditionalActionType[] | ((item: any) => AdditionalActionType[])
    disableBorderLeft?: boolean
    disableItemAdd?: boolean
    disableItemDelete?: boolean
  }
): ReactNode[] => {
  const {
    additionalActions: additionActionsIn,
    actions: actionsIn,
    disableBorderLeft,
    disableItemAdd: _disAdd,
    disableItemDelete: _disDel,
  } = properties

  const relevantElements = parentId
    ? items?.filter((el) => el._parentId === parentId)
    : items?.filter((el) => !el._parentId)

  return (
    relevantElements?.map?.(({ labelIcon, ...item }) => {
      const nodeIdAdj = (item?.nodeId ?? item?.itemId) as string
      const additionalActions =
        typeof additionActionsIn === 'function'
          ? additionActionsIn(item)
          : additionActionsIn
      const actions =
        typeof actionsIn === 'function' ? actionsIn(item) : actionsIn
      const children = (items?.filter(
        (it) => nodeIdAdj && it._parentId === nodeIdAdj
      ) ?? []) as StyledTreeItemProps[]

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children: _c, label, element_html_id: _u, ...props } = item as any

      return (
        <StyledTreeItem
          key={nodeIdAdj}
          {...props}
          labelText={label}
          labelIcon={
            typeof labelIcon === 'string' ? (
              <Icon path={labelIcon} size={1} />
            ) : (
              labelIcon
            )
          }
          icon={labelIcon ?? props?.icon}
          disableBorderLeft={disableBorderLeft}
          additionalActions={additionalActions}
          actions={actions}
        >
          {((!!children?.length &&
            recursiveMap(nodeIdAdj as any, items, properties)) as any) ||
            undefined}
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

export type CTreeViewProps = Omit<
  SimpleTreeViewProps<false>,
  'selectedItems'
> & {
  items: StyledTreeItemProps[]
  // actions?: AdditionalActionGenType
  onNodeSelect: (e: any, nodeId: string) => void
  onNodeAddAction: (e: any, nodeId: string) => void
  onNodeRemoveAction: (e: any, nodeId: string) => void
  additionalActions?: AdditionalActionGenType
  expandedItems?: string[]
  defaultExpanded?: string[]
  enableNullSelection?: boolean
  disableItemsFocusable?: boolean
  autofocus?: boolean
  maxWidth?: number
  width?: number
  rootInjection?: ReactNode
  disableSelection?: boolean
  draggable?: boolean
  hidden?: boolean
  selectedItems?: string[]
  onDragDrop?: (event: any, draggedItem: any, droppedItem: any) => void // nodeId is the id of the dropped item
  onDragging?: (event: any, active: boolean, draggedItem: any) => void
  disableItemDelete?: boolean
  disableItemAdd?: boolean
}

export const CTreeView2 = (props: CTreeViewProps) => {
  const {
    items,
    expandedItems,
    selectedItems,
    maxWidth,
    additionalActions,
    disableItemsFocusable,

    onDragDrop,
    onDragging,
    width,
    enableNullSelection,
    rootInjection,
    defaultExpanded,
    autofocus,
    disableSelection,
    draggable,
    hidden,
    onNodeAddAction,
    onNodeRemoveAction,
    onNodeSelect,
    disableItemAdd,
    disableItemDelete,
    ...rest
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

  const actions = useMemo(() => {
    const itemActions: AdditionalActionType[] = []
    if (!disableItemAdd) {
      itemActions.push({
        action: (nodeId: any, e: any) => {
          console.debug('On Node Add Action', nodeId, ',', e)
          onNodeAddAction?.(e, nodeId)
        },
        icon: mdiPlus,
        tooltip: 'Add Item',
        label: 'Add Item',
        // disabled?: boolean | undefined;
      })
    }
    if (!disableItemDelete) {
      itemActions.push({
        action: (nodeId: any, e: any) => {
          console.debug('On Node Remove Action', nodeId)
          onNodeRemoveAction?.(e, nodeId)
        },
        icon: mdiDelete,
        tooltip: 'Remove Item',
        label: 'Remove Item',
        // disabled?: boolean | undefined;
      })
    }

    return itemActions
  }, [onNodeAddAction, onNodeRemoveAction, disableItemAdd, disableItemDelete])

  // const handleDragMove = useCallback(
  //   (event: any) => {
  //     const overItem = event?.over?.data?.current
  //     // const overNodeId = overItem?.nodeId

  //     console.log('DRAG MOVE', overItem, overlay)
  //     if (!overItem || !overlay) return

  //     // onDragDrop?.(event, overlay, overItem)
  //     // setOverlay(null)
  //     // setUi((current) => ({
  //     //   ...current,
  //     //   dragging: { ctrKeyDown: false, active: false },
  //     // }))
  //     // onDragging?.(event, false, overlay)
  //     // lastMouseMoveEvent.current = null
  //   },
  //   [onDragDrop, overlay, onDragging]
  // )

  return (
    <Box position="relative">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // onDragMove={handleDragMove}
        // sensors={sensors}
      >
        <SimpleTreeView
          ref={treeViewRef}
          disabledItemsFocusable={disableItemsFocusable}
          aria-label="tree-view"
          expandedItems={expandedItems as any}
          autoFocus={autofocus}
          disableSelection={disableSelection}
          draggable={draggable}
          hidden={hidden}
          selectedItems={selectedItems?.[0] ?? ''}
          // multiSelect={true}
          defaultExpandedItems={defaultExpanded}
          {...rest}
          sx={{
            overflowY: 'auto',
            maxWidth,
            width,
            ...(treeViewProps as any),
            ...(rest?.sx ?? {}),
          }}
          onItemSelectionToggle={onNodeSelect}
        >
          {items &&
            // items?.every?.((it) => it?.nodeId) &&
            Array.isArray(items) &&
            typeof items !== 'string' &&
            items
              ?.filter?.((it: any) => !it._parentId)
              ?.map?.(
                (__item: any, idx) =>
                  !idx &&
                  recursiveMap(null, items, {
                    additionalActions: additionalActions,
                    actions,
                    disableBorderLeft: true,
                    disableItemAdd,
                    disableItemDelete,
                  })
              )}
        </SimpleTreeView>

        <DragOverlay modifiers={[restrictToVerticalAxis]}>
          {overlay && <StyledTreeItem key="overlay" {...overlay} />}
        </DragOverlay>
      </DndContext>
      {rootInjection}
    </Box>
  )
}
