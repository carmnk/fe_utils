import { mdiChevronDown, mdiChevronRight, mdiDotsHorizontal } from '@mdi/js'
import { styled, Box, Stack, Typography, useTheme, alpha } from '@mui/material'
import { TreeItemProps, TreeItem, treeItemClasses } from '@mui/x-tree-view'
import { ReactNode, Ref } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../../../components/buttons/Button'
import { DropdownMenu, DropdownMenuItem } from '../../../../components/dropdown'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import Icon from '@mdi/react'

export type StyledTreeItemProps = Omit<TreeItemProps, 'nodeId' | 'children'> & {
  bgColor?: string
  bgColorForDarkMode?: string
  color?: string
  colorForDarkMode?: string
  labelIcon?: ReactNode
  icon?: ReactNode
  labelInfo?: string
  labelText: ReactNode
  nodeId: number | string
  disableBorderLeft?: boolean
  disableAddAction?: boolean
  disableDeleteAction?: boolean

  onDelete?: (id: string) => void
  onAddChild?: (id: string) => void
  idFieldName?: string
  children?: StyledTreeItemProps[]

  actions?: any[] | ((item: any) => any[])
  additionalActions?: any[] | ((item: any) => any[])
  useDraggable?: boolean
  toggleExpand?: (id: string, e: any) => void
  _parentId: string | null
  isNotDroppable?: boolean
  onChangeDraggingActive?: (active: boolean) => void
  disableExpandMargin?: boolean
  ref?: Ref<HTMLUListElement>
}

const StyledTreeItemRoot = styled(TreeItem)<
  TreeItemProps & {
    nodeId: string
    isNotDroppable: boolean
    disableExpandMargin: boolean
  }
>(({ theme, isNotDroppable }) => {
  return {
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
      background: isNotDroppable ? 'red' : undefined,
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

    // : {
    //     marginRight: '0px !important',
    //     width: 0,
    //   },
  }
}) as any

export const StyledTreeItem = function StyledTreeItem(
  props: StyledTreeItemProps
) {
  const theme = useTheme()
  const {
    bgColor,
    color,
    labelIcon,
    icon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    nodeId,
    disableBorderLeft,
    additionalActions,
    // useDraggable: doUseDraggable,
    actions,
    toggleExpand,
    onChangeDraggingActive,
    disableExpandMargin,
    ref,
    _parentId: _pOut,
    ...other
  } = props

  const LabelIcon = labelIcon ?? icon
  const nodeIdAdj = (nodeId ?? other.itemId) as string

  const {
    attributes,
    listeners,
    setNodeRef,
    // isDragging,
    transform,
    active: isDragActive,
  } = useDraggable({
    id: nodeIdAdj as string,
    data: props,
    disabled: false,
  })
  const { isOver, setNodeRef: setNodeDropRef } = useDroppable({
    id: nodeIdAdj as string,
    disabled: !!transform,
    data: props,
  })

  useEffect(() => {
    onChangeDraggingActive?.(!!isDragActive)
    // only when isDragActive changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragActive])

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
      '&>div': {
        '&>div:first-of-type': {
          width: disableExpandMargin ? 0 : undefined,
          marginRight: disableExpandMargin ? '0 !important' : undefined,
          marginLeft: disableExpandMargin ? 0 : undefined,
        },
      },
    }),
    [
      theme.palette,
      color,
      colorForDarkMode,
      bgColor,
      bgColorForDarkMode,
      disableBorderLeft,
      isOver,
      disableExpandMargin,
    ]
  )

  const handleMoreActionsClick = useCallback((e: any) => {
    e?.stopPropagation?.()
    setUi((current) => ({
      ...current,
      moreActionsOpen: !current?.moreActionsOpen,
    }))
  }, [])

  const stopPropagation = useCallback((e: any) => e.stopPropagation(), [])
  const stopPropagationPreventDefault = useCallback((e: any) => {
    e.stopPropagation()
    e.preventDefault()
  }, [])

  const preventTreeItemClickWhenDraggin = useMemo(
    () =>
      isDragActive
        ? {
            onClick: (e: any) => {
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
        // {...listeners}
        ref={setNodeRef}
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
              maxWidth={'calc(100% - 64px)'}
              alignItems="center"
            >
              <Box
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
                {LabelIcon && typeof LabelIcon === 'string' ? (
                  <Icon path={LabelIcon} size={1} />
                ) : (
                  LabelIcon
                )}
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
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { action: _, ...rest } = action
                  return (
                    <Button
                      {...rest}
                      variant="outlined"
                      disabled={action?.disabled}
                      key={aIdx}
                      iconButton={true}
                      icon={action.icon}
                      tooltip={action.tooltip}
                      onClick={(e) => {
                        if (!action.disableStopPropagation) {
                          e.stopPropagation()
                        }
                        const actionFn = action.action as any
                        // console.log('actionFn', actionFn, nodeId, nodeIdAdj)
                        !!nodeIdAdj && actionFn?.(nodeIdAdj as any, e)
                      }}
                      onPointerDown={stopPropagation}
                      onKeyDown={stopPropagation}
                      iconSize="16px"
                      sx={{
                        height: 24,
                        width: 24,
                      }}
                      {...(action?.useDragListeners ? listeners : {})}
                    />
                  )
                })}

                {!!additionalActions?.length && (
                  <Button
                    variant="outlined"
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
        sx={styleProps}
        slots={{
          collapseIcon: () => (
            <Button
              variant="outlined"
              iconButton={true}
              icon={mdiChevronDown}
              onPointerDown={stopPropagationPreventDefault}
              onKeyDown={stopPropagationPreventDefault}
              onClick={(e) => toggleExpand?.(nodeIdAdj as string, e)}
            />
          ),
          expandIcon: () => (
            <Button
              variant="outlined"
              iconButton={true}
              icon={mdiChevronRight}
              onPointerDown={stopPropagation}
              onKeyDown={stopPropagation}
              onClick={(e) => toggleExpand?.(nodeIdAdj as string, e)}
            />
          ),
        }}
        {...other}
        itemId={nodeIdAdj}
        itemID={nodeIdAdj}
      />
      <DropdownMenu
        // usePortal={true}
        anchorEl={moreActionsButtonRef.current}
        open={ui?.moreActionsOpen}
        // onPointerDown={stopPropagation}
        // onKeyDown={stopPropagation}
        onClose={handleMoreActionsClick as any}
      >
        {additionalActionsInt?.map((action, aIdx) => (
          <DropdownMenuItem
            key={aIdx}
            id={'action_' + aIdx}
            label={action.label}
            icon={action.icon}
            onPointerDown={stopPropagation}
            onKeyDown={stopPropagation}
            onClick={(e: any) => {
              e.stopPropagation()
              action.action(nodeIdAdj, e)
              handleMoreActionsClick(e)
            }}
            disabled={action.disabled}
            tooltip={action.tooltip}
            sourceAnchorEl={moreActionsButtonRef.current as HTMLElement}
          ></DropdownMenuItem>
        ))}
      </DropdownMenu>
    </>
  )
}
