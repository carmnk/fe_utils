import { DropDownMenuItemProps } from '@cmk/fe_utils'
import { Button, DropdownMenuItem, DropdownMenu } from '@cmk/fe_utils'
import {
  mdiChevronDown,
  mdiChevronRight,
  mdiCollapseAllOutline,
  mdiExpandAllOutline,
} from '@mdi/js'
import { Box } from '@mui/material'
import {
  KeyboardEvent,
  memo,
  PointerEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

const ButtonMemo = memo(Button)

export type ExpandIconProps = {
  nodeId: string
  toggleExpand: (nodeId: string, e: any) => void
  expandAllChildren?: (nodeId: string) => void
  collapseAllChildren?: (nodeId: string) => void
  forCollapedIcon?: boolean
}

const stopPropagation = (e: Event) => e.stopPropagation()
const dropDownMenuItemSx = { height: 32, px: 1 }

const anchorOrigin = {
  vertical: 'top' as const,
  horizontal: 'right' as const,
}
const transformOrigin = {
  vertical: 'bottom' as const,
  horizontal: 'left' as const,
}

export const ExpandIcon = (props: ExpandIconProps) => {
  const {
    nodeId,
    toggleExpand,
    expandAllChildren,
    collapseAllChildren,
    forCollapedIcon,
  } = props

  const buttonSx = useMemo(() => {
    const bgcolor = forCollapedIcon ? '#666' : undefined
    const hoverStyles = forCollapedIcon
      ? { '&:hover': { bgcolor: '#666' } }
      : {}
    return { width: 16, bgcolor, ...hoverStyles }
  }, [forCollapedIcon])

  const expandIconRef = useRef<HTMLButtonElement>(null)
  const preventPointerUpAfterDelay = useRef<boolean>(false)
  const [ui, setUi] = useState({
    isMoreActionsOpen: false,
  })

  const handleOpenMenu = useCallback(() => {
    setUi((current) => ({
      ...current,
      isMoreActionsOpen: true,
    }))
  }, [setUi])
  const handleCloseMenu = useCallback(() => {
    setUi((current) => ({
      ...current,
      isMoreActionsOpen: false,
    }))
  }, [setUi])
  const onPointerDown = useCallback(
    (e: any) => {
      e.preventDefault()
      e.stopPropagation()
      setTimeout(() => {
        handleOpenMenu()
        preventPointerUpAfterDelay.current = true
      }, 1000)
    },
    [handleOpenMenu]
  )

  const items = useMemo(
    () => [
      {
        label: 'Expand all children',
        icon: mdiExpandAllOutline,
        action: (e: any) => {
          e?.stopPropagation?.()
          e?.preventDefault?.()
          expandAllChildren?.(nodeId)
          preventPointerUpAfterDelay.current = false
        },
      },
      {
        label: 'Collapse all children',
        icon: mdiCollapseAllOutline,
        action: (e: any) => {
          e?.stopPropagation?.()
          e?.preventDefault?.()
          collapseAllChildren?.(nodeId)
          preventPointerUpAfterDelay.current = false
        },
      },
    ],
    [expandAllChildren, collapseAllChildren, nodeId]
  )

  const handleExpandButtonPointerUp = useCallback(
    (e: PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (preventPointerUpAfterDelay.current) {
        return
      }
      toggleExpand?.(nodeId as string, e)
    },
    [toggleExpand, nodeId]
  )

  const dropdownItemsProps = useMemo(() => {
    return items?.map((item, iIdx) => ({
      id: 'action_' + iIdx,
      label: item.label,
      icon: item.icon,
      // onPointerDown={stopPropagation}
      onKeyDown: (e: KeyboardEvent<HTMLLIElement>) => e.stopPropagation(),
      onPointerUp: (e: PointerEvent) => e.stopPropagation(),
      onClick: stopPropagation as unknown as DropDownMenuItemProps['onClick'],
      onPointerDown: (e: any) => {
        e.stopPropagation()
        item?.action?.(e)
        handleCloseMenu()
      },
    }))
  }, [items, handleCloseMenu])

  return (
    <Box position="relative" ref={expandIconRef}>
      <ButtonMemo
        id={nodeId as string}
        variant={'contained'}
        sx={buttonSx}
        iconButton={true}
        icon={forCollapedIcon ? mdiChevronDown : mdiChevronRight}
        onPointerUp={handleExpandButtonPointerUp}
        onPointerDown={
          collapseAllChildren && expandAllChildren && onPointerDown
        }
      />
      {collapseAllChildren && expandAllChildren && (
        <DropdownMenu
          open={ui.isMoreActionsOpen}
          anchorEl={expandIconRef.current}
          onClose={handleCloseMenu as any}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
        >
          {items?.map((_action, aIdx) => (
            <DropdownMenuItem
              iconGap={1}
              key={aIdx}
              {...dropdownItemsProps?.[aIdx]}
              sx={dropDownMenuItemSx}
            ></DropdownMenuItem>
          ))}
        </DropdownMenu>
      )}
    </Box>
  )
}
