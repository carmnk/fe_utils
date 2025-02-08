import { mdiChevronDown, mdiChevronRight, mdiDotsHorizontal } from '@mdi/js'
import { styled, Box, Stack, Typography, useTheme, alpha } from '@mui/material'
import { TreeItemProps, TreeItem, treeItemClasses } from '@mui/x-tree-view'
import {
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  useImperativeHandle,
  Ref,
} from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Button } from '../buttons/Button/Button'
import { DropdownMenu } from '../dropdown/DropdownMenu'
import { DropdownMenuItem } from '../dropdown/DropdownMenuItem'
import { AdditionalActionType } from './CTreeView'
import { useDraggable, useDroppable } from '@dnd-kit/core'

export type StyledTreeItemProps = Omit<TreeItemProps, 'nodeId' | 'children'> & {
  bgColor?: string
  bgColorForDarkMode?: string
  color?: string
  colorForDarkMode?: string
  labelIcon?: ReactNode
  labelInfo?: string
  labelText: string
  nodeId: number | string
  disableBorderLeft?: boolean
  disableAddAction?: boolean
  disableDeleteAction?: boolean

  onDelete?: (id: string) => void
  onAddChild?: (id: string) => void
  idFieldName?: string
  children?: StyledTreeItemProps[]

  actions?: AdditionalActionType[] | ((item: any) => AdditionalActionType[])
  additionalActions?:
    | AdditionalActionType[]
    | ((item: any) => AdditionalActionType[])
  useDraggable?: boolean
  toggleExpand?: (id: string) => void
  _parentId: string | null
  ref?: Ref<HTMLElement>
}

const StyledTreeItemRoot = styled(TreeItem)<TreeItemProps & { nodeId: string }>(
  ({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
      color: theme.palette.text.secondary,
      borderTopRightRadius: theme.spacing(0.5),
      borderBottomRightRadius: theme.spacing(0.5),
      paddingLeft: '4px !important',
      paddingRight: '4px !important',
      fontWeight: theme.typography.fontWeightMedium,
      '&.Mui-expanded': {
        fontWeight: theme.typography.fontWeightRegular,
      },
      // '&:hover': {
      //   backgroundColor: theme.palette.action.hover + " !important",
      // },
      // '&:focused': {
      //   backgroundColor: "transparent",
      // },
      '&.Mui-selected': {
        // backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        color: 'var(--tree-view-color)',
      },
      '&.Mui-focused': {
        '&:not(.Mui-selected)': {
          background: 'none',
        },
        // backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
        // color: 'var(--tree-view-color)',
      },
      [`& .${treeItemClasses.label}`]: {
        fontWeight: 'inherit',
        color: 'inherit',
      },
    },
    [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: 0,
      paddingLeft: 8,
      [`& .${treeItemClasses.content}`]: {
        paddingLeft: theme.spacing(2),
      },
    },
    '&.MuiTreeItem-group, &.MuiCollapse-root': {
      marginLeft: '16px !important',
    },
  })
)

export const StyledTreeItem = function StyledTreeItem(
  props: StyledTreeItemProps
) {
  const theme = useTheme()
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    nodeId,
    disableBorderLeft,
    additionalActions,
    useDraggable: doUseDraggable,
    actions,
    toggleExpand,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    children: _c,
    ref,
    ...other
  } = props

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    active: isDragActive,
  } = useDraggable({
    id: nodeId as string,
    data: props,
    disabled: !doUseDraggable,
  })
  const { isOver, setNodeRef: setNodeDropRef } = useDroppable({
    id: nodeId as string,
    disabled: !!transform,
    data: props,
  })
  const itemRef = useRef<HTMLElement | null>(null)
  const handleSetNodeRef = useCallback(
    (element: HTMLElement | null) => {
      setNodeRef(element)
      itemRef.current = element
    },
    [setNodeRef]
  )
  useImperativeHandle(ref, () => itemRef.current as HTMLElement)

  const moreActionsButtonRef = useRef<HTMLButtonElement>(null)
  const [ui, setUi] = useState({ moreActionsOpen: false })

  const styleProps = useMemo(
    () => ({
      borderLeft: disableBorderLeft
        ? undefined
        : `1px dashed ` + alpha(theme.palette.primary.main, 0.66),
      backgroundColor: isOver ? theme.palette.action.hover : undefined,
      '--tree-view-color':
        theme.palette.mode !== 'dark' ? color : colorForDarkMode,
      '--tree-view-bg-color':
        theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
    }),
    [
      theme.palette,
      color,
      colorForDarkMode,
      bgColor,
      bgColorForDarkMode,
      disableBorderLeft,
      isOver,
    ]
  )

  const handleMoreActionsClick = useCallback((e?: MouseEvent) => {
    e?.stopPropagation?.()
    setUi((current) => ({
      ...current,
      moreActionsOpen: !current?.moreActionsOpen,
    }))
  }, [])

  const stopPropagation = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => e.stopPropagation(),
    []
  )
  const stopPropagationPreventDefault = useCallback(
    (e: PointerEvent<HTMLButtonElement> & KeyboardEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
    },
    []
  )

  const preventTreeItemClickWhenDraggin = useMemo(
    () =>
      isDragActive
        ? {
            onClick: (e: MouseEvent) => {
              e.stopPropagation()
              e.preventDefault()
            },
          }
        : {},
    [isDragActive]
  )

  const actionsInt = useMemo(() => {
    if (!actions) return []
    return typeof actions === 'function' ? actions(props) : actions
  }, [actions, props])
  const additionalActionsInt = useMemo(() => {
    if (!additionalActions) return []
    return typeof additionalActions === 'function'
      ? additionalActions(props)
      : additionalActions
  }, [additionalActions, props])

  return (
    <>
      <StyledTreeItemRoot
        {...attributes}
        {...listeners}
        slots={{
          collapseIcon: () => (
            <Button
              iconButton={true}
              icon={mdiChevronDown}
              variant="text"
              onPointerDown={stopPropagationPreventDefault}
              onKeyDown={stopPropagationPreventDefault}
              onClick={() => toggleExpand?.(nodeId as string)}
            />
          ),
          expandIcon: () => (
            <Button
              iconButton={true}
              icon={mdiChevronRight}
              variant="text"
              onPointerDown={stopPropagationPreventDefault}
              onKeyDown={stopPropagationPreventDefault}
              onClick={() => toggleExpand?.(nodeId as string)}
            />
          ),
        }}
        ref={handleSetNodeRef}
        nodeId={nodeId as string}
        label={
          <Box
            ref={setNodeDropRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 0.5,
              pr: 0,
              gap: 1,
              justifyContent: 'space-between',
            }}
            {...preventTreeItemClickWhenDraggin}
          >
            <Stack
              direction="row"
              maxWidth={`calc(100% - ${
                ((actionsInt?.length ?? 0) +
                  (additionalActions?.length ? 1 : 0)) *
                39
              }px)`}
              alignItems="center"
            >
              <Box
                component="div"
                color="inherit"
                sx={{
                  mr: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPointerDown={stopPropagation}
                onKeyDown={stopPropagation}
              >
                {LabelIcon}
              </Box>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'inherit',
                  flexGrow: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {labelText}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Typography variant="caption" color="inherit">
                {labelInfo}
              </Typography>

              <Stack direction="row" justifyContent="flex-end" gap={1}>
                {actionsInt?.map?.((action, aIdx) => {
                  return (
                    <Button
                      disabled={action?.disabled}
                      key={aIdx}
                      iconButton={true}
                      icon={action.icon}
                      tooltip={action.tooltip}
                      onClick={(e) => {
                        e.stopPropagation()
                        const actionFn = action.action
                        !!nodeId && actionFn?.(nodeId as string, e)
                      }}
                      onPointerDown={stopPropagation}
                      onKeyDown={stopPropagation}
                      iconSize="16px"
                      sx={{
                        height: 24,
                        width: 24,
                      }}
                    />
                  )
                })}

                {!!additionalActions?.length && (
                  <Button
                    ref={moreActionsButtonRef}
                    iconButton={true}
                    icon={mdiDotsHorizontal}
                    onClick={handleMoreActionsClick}
                    size="small"
                    iconSize="16px"
                    onPointerDown={stopPropagation}
                    onKeyDown={stopPropagation}
                    sx={{ height: 24, width: 24 }}
                  />
                )}
              </Stack>
            </Stack>
          </Box>
        }
        style={styleProps}
        {...other}
      >
        {/* {children} */}
      </StyledTreeItemRoot>
      <DropdownMenu
        // usePortal={true}
        anchorEl={moreActionsButtonRef.current}
        open={ui?.moreActionsOpen}
        // onPointerDown={stopPropagation}
        // onKeyDown={stopPropagation}
        onClose={() => handleMoreActionsClick()}
      >
        {additionalActionsInt?.map((action, aIdx) => (
          <DropdownMenuItem
            key={aIdx}
            id={'action_' + aIdx}
            label={action.label}
            icon={action.icon}
            onPointerDown={stopPropagation}
            onKeyDown={stopPropagation}
            onClick={(e: MouseEvent) => {
              e.stopPropagation()
              action.action(nodeId, e)
              handleMoreActionsClick(e)
            }}
            disabled={action.disabled}
          ></DropdownMenuItem>
        ))}
      </DropdownMenu>
    </>
  )
}
