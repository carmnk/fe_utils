import { useGesture } from '@use-gesture/react'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { useState, useMemo } from 'react'

export type UseDraggableRowsParams = {
  rows: any[]
  reorderRowId?: string | undefined
  onReorder?: (startDragItem: any, currentHoverItem: any) => void
}
/**
 * Hook to make rows draggable
 * @param rows - array of rows (a row=object/dict) to be reordered
 * @param reorderRowId - To enable dragging it is required to pass here the name of the id field/column in the row object (e.g. 'id')
 * @param onReorder - callback function to be called when the row is dragged and dropped
 * @returns {..., draggedRows: any[]} - draggedRows is the reordered array of rows while dragging
 * @returns {..., bind: (...args: any[]) => ReactDOMAttributes } - is the bind object to be passed to the TableRow component (attaches dom event to <tr/>s)
 */
export const useDraggableRows = (
  params: UseDraggableRowsParams
): {
  draggedRows: any[]
  bind: (...args: any[]) => ReactDOMAttributes
  hoverItemId: string | number | boolean
  draggedItemId: string | number | boolean
} => {
  const { rows, reorderRowId, onReorder } = params
  const [dragging, setDragging] = useState<{
    startDragItem: { [key: string]: any; _idx: number }
    currentHoverItem: { [key: string]: any; _idx: number }
  }>({ startDragItem: { _idx: -1 }, currentHoverItem: { _idx: -1 } })

  const bind = useGesture(
    {
      onHover: (state) => {
        const _idx = state?.args?.[1]
        const item = rows?.[_idx]
        if (item) {
          setDragging((current) => ({
            ...current,
            currentHoverItem: !state?.active ? {} : { ...item, _idx },
          }))
        }
      },
      // onDrag: (state) => {
      //   console.log('GENERIC DRAGGING!', state)
      //   // if /
      // },
      onDragStart: (state) => {
        const item = state?.args?.[0]
        const _idx = state?.args?.[1]
        setDragging((current) => ({
          ...current,
          startDragItem: { ...item, _idx },
        }))
      },
      onDragEnd: (state) => {
        onReorder?.(dragging?.startDragItem, dragging?.currentHoverItem)
        setDragging({
          startDragItem: { _idx: -1 },
          currentHoverItem: { _idx: -1 },
        })
      },
    },
    {
      enabled: !!reorderRowId,
      // hover :{
      //   po
      // }
      drag: { pointer: { capture: false } },
    }
  )

  const draggedItemId = !reorderRowId
    ? null
    : rows?.find(
        (row) => row?.[reorderRowId] === dragging?.startDragItem?.[reorderRowId]
      )?.[reorderRowId]
  const hoverItemId = !reorderRowId
    ? null
    : rows?.find(
        (row) =>
          row?.[reorderRowId] === dragging?.currentHoverItem?.[reorderRowId]
      )?.[reorderRowId]

  const adjRows = useMemo(() => {
    if (
      !draggedItemId ||
      !hoverItemId ||
      draggedItemId === hoverItemId ||
      !reorderRowId
    )
      return rows
    return rows?.map((row, rIdx) =>
      row?.[reorderRowId] === draggedItemId
        ? dragging?.currentHoverItem
        : row?.[reorderRowId] === hoverItemId
          ? dragging?.startDragItem
          : row
    )
  }, [dragging, rows, draggedItemId, hoverItemId, reorderRowId])
  return { draggedRows: adjRows, bind, draggedItemId, hoverItemId }
}
