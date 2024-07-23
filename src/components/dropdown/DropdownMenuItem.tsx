import { MouseEvent, useCallback, useMemo } from 'react'
import {
  MenuItem,
  Tooltip,
  Stack,
  CircularProgress,
  MenuItemProps,
} from '@mui/material'
import { useTheme, Divider, Typography } from '@mui/material'
import Icon from '@mdi/react'

export type DropDownMenuItemProps = {
  onClick: (e: MouseEvent) => void
  tooltip?: React.ReactNode
  icon?: React.ReactNode
  id: string
  disabled?: boolean
  loading?: boolean
  label: string
  onPointerDown?: any
  onKeyDown?: any
  sx?: MenuItemProps['sx']
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
    sx,
  } = props
  const theme = useTheme()
  const handleOnClick = useCallback(
    (e: MouseEvent) => {
      if (disabled || loading) return
      onClick(e)
    },
    [disabled, loading, onClick]
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
            gap={loading || icon ? 2 : 0}
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
