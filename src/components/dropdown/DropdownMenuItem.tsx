import {
  KeyboardEventHandler,
  MouseEvent,
  PointerEventHandler,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'
import { MenuItem, Tooltip, Stack } from '@mui/material'
import { CircularProgress, MenuItemProps } from '@mui/material'
import { useTheme, Divider, Typography } from '@mui/material'
import Icon from '@mdi/react'

export type DropDownMenuItemProps = Omit<MenuItemProps, 'onClick'> & {
  onClick?: (e: MouseEvent, sourceAnchorEl?: HTMLElement) => void
  tooltip?: ReactNode
  icon?: ReactNode
  id: string
  disabled?: boolean
  loading?: boolean
  label: ReactNode
  onPointerDown?: PointerEventHandler<HTMLLIElement>
  onKeyDown?: KeyboardEventHandler<HTMLLIElement>
  sx?: MenuItemProps['sx']
  iconGap?: number
  sourceAnchorEl?: HTMLElement
}

const SlimDivider = (props: { id: string }) => (
  <Divider
    sx={{ mt: '0px !important', mb: '0px !important' }}
    key={'menu-offer-divider' + (props?.id ?? '')}
  />
)
const itemStyles = { px: 2, py: 1.25, width: '100%' }

export const DropdownMenuItem = (props: DropDownMenuItemProps) => {
  const {
    onClick,
    tooltip,
    id,
    icon,
    disabled,
    loading,
    label,
    onPointerDown,
    onKeyDown,
    iconGap,
    sx,
    sourceAnchorEl,
  } = props
  const theme = useTheme()
  const handleOnClick = useCallback(
    (e: MouseEvent) => {
      if (disabled || loading) return
      onClick?.(e, sourceAnchorEl)
    },
    [disabled, loading, onClick, sourceAnchorEl]
  )

  const itemStylesAdj = useMemo(() => ({ ...itemStyles, ...sx }), [sx])

  return (
    <>
      <MenuItem
        sx={itemStylesAdj}
        key={id}
        onClick={handleOnClick}
        disabled={disabled}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <Tooltip title={tooltip} placement="top" arrow>
          <Stack
            direction="row"
            justifyItems="center"
            alignItems="center"
            gap={loading || icon ? (iconGap ?? 2) : 0}
            width={'100%'}
          >
            <Stack
              direction="row"
              alignItems="center"
              width={loading || icon ? '17px' : 0}
            >
              {loading ? (
                <CircularProgress color="inherit" size={17} />
              ) : typeof icon === 'string' ? (
                <Icon
                  path={icon}
                  size={'20px'}
                  color={
                    disabled
                      ? theme.palette.action.disabled
                      : theme.palette.text.primary
                  }
                />
              ) : (
                icon
              )}
            </Stack>
            <Typography
              sx={{
                color: disabled
                  ? theme.palette.action.disabled
                  : theme.palette.text.primary,
              }}
              variant="body2"
              width={'100%'}
            >
              {label}
            </Typography>
          </Stack>
        </Tooltip>
      </MenuItem>
      <SlimDivider id={id} />
    </>
  )
}
