import Icon from '@mdi/react'
import { ButtonDropdown } from './defs'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import { CircularProgress, Stack, useTheme } from '@mui/material'
import { CSSProperties } from 'react'
import { CButtonProps } from './Button'

type ButtonStartIconProps = {
  loading?: boolean
  icon?: React.ReactNode
  iconButton?: boolean
  iconSize?: CSSProperties['fontSize']
  iconColor?: string
  disabled?: boolean
  variant?: CButtonProps['variant']
  startIconProps?: NonNullable<CButtonProps['slotProps']>['startIcon']
  loadingIconContainerProps?: NonNullable<
    CButtonProps['slotProps']
  >['loadingIconContainer']
  loadingProgressProps?: NonNullable<
    CButtonProps['slotProps']
  >['loadingProgress']
}
export const ButtonStartIcon = (props: ButtonStartIconProps) => {
  const {
    loading,
    icon,
    iconSize,
    iconColor,
    disabled,
    variant,
    iconButton,
    startIconProps,
    loadingIconContainerProps,
    loadingProgressProps,
  } = props
  const theme = useTheme()
  return loading ? (
    <Stack
      direction="row"
      alignItems="center"
      width="17px"
      mr={iconButton ? undefined : 1}
      {...loadingIconContainerProps}
    >
      <CircularProgress color="inherit" size={17} {...loadingProgressProps} />
    </Stack>
  ) : typeof icon === 'string' ? (
    <Icon
      path={icon}
      size={iconSize ?? '16px'}
      color={
        iconColor ??
        (disabled
          ? theme.palette.action.disabled
          : variant === 'outlined' || variant === 'text'
            ? theme.palette.text.primary
            : theme.palette.primary.contrastText)
      }
      {...startIconProps}
    />
  ) : (
    icon
  )
}

export const ButtonEndIcon = (
  props: Pick<ButtonStartIconProps, 'disabled' | 'iconColor' | 'variant'> & {
    endIcon: React.ReactNode
    dropdown?: ButtonDropdown
    endIconProps?: NonNullable<CButtonProps['slotProps']>['endIcon']
  }
) => {
  const { endIcon, iconColor, disabled, variant, dropdown, endIconProps } =
    props
  const theme = useTheme()
  return dropdown ? (
    <Icon
      path={dropdown === 'closed' ? mdiChevronDown : mdiChevronUp}
      size="16px"
      color={
        iconColor ??
        (disabled
          ? theme.palette.action.disabled
          : variant === 'outlined' || variant === 'text'
            ? theme.palette.text.primary
            : theme.palette.primary.contrastText)
      }
      {...endIconProps}
    />
  ) : typeof endIcon === 'string' ? (
    <Icon
      path={endIcon}
      size="16px"
      color={
        iconColor ??
        (disabled
          ? theme.palette.action.disabled
          : variant === 'outlined' || variant === 'text'
            ? theme.palette.text.primary
            : theme.palette.primary.contrastText)
      }
      {...endIconProps}
    />
  ) : (
    endIcon
  )
}
