import { mdiDotsHorizontal } from '@mdi/js'
import { styled, Box, Stack, Typography, useTheme, alpha } from '@mui/material'
import { TreeItemProps, TreeItem, treeItemClasses } from '@mui/x-tree-view'
import {
  ForwardRefExoticComponent,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AdditionalActionType } from './CTreeView'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import Icon from '@mdi/react'
import { ExpandIcon } from './ExpandIcon'
import { Button } from '../buttons'
import { DropdownMenu, DropdownMenuItem } from '../dropdown'

const slotProps = {
  groupTransition: { style: { transitionDuration: '180ms' } },
}

export type StyledTreeItemProps = Omit<
  TreeItemProps,
  'nodeId' | 'itemId' | 'children'
> & {
  bgColor?: string
  bgColorForDarkMode?: string
  color?: string
  colorForDarkMode?: string
  labelIcon?: ReactNode
  labelInfo?: string

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
  toggleExpand?: (id: string, e: any) => void
  expandAllChildren?: (id: string) => void
  collapseAllChildren?: (id: string) => void

  isNotDroppable?: boolean
  onChangeDraggingActive?: (active: boolean) => void
  disableExpandMargin?: boolean

  // actually required but to avoid injecting in html element attributes -> temporarily optional
  nodeId?: number | string
  _parentId?: string | null
  labelText?: string
}

const StyledTreeItemRoot = styled(TreeItem)<
  TreeItemProps & {
    itemId: string
    isNotDroppable?: boolean
    // disableExpandMargin: boolean
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
      //   borderTop: '1px solid ' + theme.palette.secondary.main + ' !important',
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
}) as unknown as ForwardRefExoticComponent<
  StyledTreeItemProps & {
    itemId: string
    isNotDroppable?: boolean
    // disableExpandMargin: boolean
  }
>

export const StyledTreeItem = function StyledTreeItem(
  props: StyledTreeItemProps & {
    state: unknown
    formGen: unknown
    schema: unknown
    component: unknown
    ref?: Ref<HTMLUListElement>
    itemId?: string
    toggleSelect?: (id: string) => void
  }
) {
  const theme = useTheme()
  const {
    bgColor,
    color,
    labelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    nodeId,
    disableBorderLeft,
    additionalActions,
    actions,
    toggleExpand,
    onChangeDraggingActive,
    disableExpandMargin,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    useDraggable: doUseDraggable,
    disableDeleteAction,
    disableAddAction,
    _parentId,
    schema,
    formGen,
    state,
    component,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    expandAllChildren,
    collapseAllChildren,
    toggleSelect,
    children,
    sx,
    ...other
  } = props

  const {
    attributes,
    listeners,
    setNodeRef,
    // isDragging,
    transform,
    active: isDragActive,
  } = useDraggable({
    id: nodeId as string,
    data: props,
    disabled: false,
  })
  const { isOver, setNodeRef: setNodeDropRef } = useDroppable({
    id: nodeId as string,
    disabled: !!transform,
    data: props,
  })

  useEffect(() => {
    // if (isDragActive?.id === nodeId) {
    //   console.log('changed ', isDragActive, nodeId, attributes, listeners)
    // }
    onChangeDraggingActive?.(!!isDragActive)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragActive])

  const moreActionsButtonRef = useRef<HTMLButtonElement>(null)
  const [ui, setUi] = useState({
    moreActionsOpen: false,
  })

  const styleProps = useMemo(
    () => ({
      ...(sx ?? {}),
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
      sx,
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

  const handleMoreActionsClick = useCallback(
    (e: any) => {
      e?.stopPropagation?.()
      toggleSelect?.(props?.nodeId as string)
      setUi((current) => ({
        ...current,
        moreActionsOpen: !current?.moreActionsOpen,
      }))
    },
    [props?.nodeId, toggleSelect]
  )

  const stopPropagation = useCallback((e: any) => e.stopPropagation(), [])

  const preventTreeItemClickWhenDraggin = useMemo(() => {
    const preventActions: any = isDragActive
      ? {
          onClick: (e: any) => {
            e.stopPropagation()
            e.preventDefault()
          },
        }
      : {}
    // if (isDragActive?.id !== nodeId) {
    //   preventActions.onPointerMove = (e: any) => {
    //     e.stopPropagation()
    //     e.preventDefault()
    //   }
    // }
    return preventActions
  }, [isDragActive, nodeId])

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

  const refMemo = useMemo(() => ({ ref: setNodeRef }), [setNodeRef])

  return (
    <>
      <StyledTreeItemRoot
        className={other.className}
        {...attributes}
        {...refMemo}
        itemID={nodeId as string}
        // nodeId={nodeId as string}
        // _parentId={_parentId as string}
        // labelText={labelText}
        slots={{
          collapseIcon: () =>
            !disableExpandMargin &&
            !!toggleExpand && (
              <ExpandIcon
                nodeId={nodeId as string}
                toggleExpand={toggleExpand}
                expandAllChildren={expandAllChildren}
                collapseAllChildren={collapseAllChildren}
                forCollapedIcon={true}
              />
            ),
          expandIcon: () =>
            !disableExpandMargin &&
            !!toggleExpand && (
              <ExpandIcon
                nodeId={nodeId as string}
                toggleExpand={toggleExpand}
                expandAllChildren={expandAllChildren}
                collapseAllChildren={collapseAllChildren}
              />
            ),
        }}
        slotProps={slotProps}
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
                {typeof labelIcon === 'string' ? (
                  <Icon path={labelIcon} size={1} />
                ) : (
                  labelIcon
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
                  const {
                    action: _a,
                    disableStopPropagation: _d,
                    useDragListeners: _u,
                    ...rest
                  } = action
                  return (
                    <Button
                      variant={isDragActive ? 'outlined' : 'contained'}
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
                        !!nodeId && actionFn?.(nodeId as any, e)
                      }}
                      onPointerDown={stopPropagation}
                      onKeyDown={stopPropagation}
                      {...(rest as any)}
                      iconSize="16px"
                      sx={{
                        height: 24,
                        width: 24,
                      }}
                      {...(action?.useDragListeners &&
                      (!isDragActive || isDragActive.id === nodeId)
                        ? listeners
                        : {})}
                    />
                  )
                })}

                {!!additionalActions?.length && (
                  <Button
                    variant={isDragActive ? 'outlined' : 'contained'}
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
        itemId={(nodeId ?? other.itemId) as string}
        // {...other}
      >
        {children}
      </StyledTreeItemRoot>
      <DropdownMenu
        anchorEl={moreActionsButtonRef.current}
        open={ui?.moreActionsOpen}
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
            onClick={(e: any, sourceAnchorEl?: HTMLElement) => {
              e.stopPropagation()
              if (sourceAnchorEl) {
                action.action(nodeId as any, e, sourceAnchorEl)
              }
              handleMoreActionsClick(e)
            }}
            disabled={action.disabled}
            tooltip={action.tooltip}
            sourceAnchorEl={moreActionsButtonRef.current as HTMLElement}
          />
        ))}
      </DropdownMenu>
    </>
  )
}
