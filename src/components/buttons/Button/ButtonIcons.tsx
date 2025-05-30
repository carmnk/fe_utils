import Icon from '@mdi/react'
import { ButtonDropdown } from './defs'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import { useTheme } from '@mui/material'
import { CSSProperties, ReactNode } from 'react'
import { CButtonProps } from './Button'
import { CIcon } from '../../icon/Icon'

type ButtonStartIconProps = {
  color: string | undefined
  icon?: ReactNode
  iconSize?: CSSProperties['fontSize']
  iconColor?: string
  disabled?: boolean
  variant?: CButtonProps['variant']
  startIconProps?: NonNullable<CButtonProps['slotProps']>['startIcon']
}
export const ButtonStartIcon = (props: ButtonStartIconProps) => {
  const {
    icon,
    iconSize,
    iconColor,
    disabled,
    variant,
    startIconProps,
    color,
  } = props
  const theme = useTheme()
  const colorAdj = (color ?? 'primary') as 'primary'
  return typeof icon === 'string' ? (
    <CIcon
      path={icon}
      size={(iconSize as any) ?? '16px'}
      color={
        (iconColor as any) ??
        (disabled
          ? theme.palette.action.disabled
          : variant === 'outlined' || variant === 'text'
            ? theme.palette?.[colorAdj]?.main
            : theme.palette?.[colorAdj]?.contrastText)
      }
      {...(startIconProps as any)}
    />
  ) : (
    icon
  )
}

export const ButtonEndIcon = (
  props: Pick<ButtonStartIconProps, 'disabled' | 'iconColor' | 'variant'> & {
    endIcon: ReactNode
    dropdown?: ButtonDropdown
    endIconProps?: NonNullable<CButtonProps['slotProps']>['endIcon']
    color: string | undefined
  }
) => {
  const {
    endIcon,
    iconColor,
    disabled,
    variant,
    dropdown,
    endIconProps,
    color,
  } = props
  const theme = useTheme()
  const colorAdj = (color ?? 'primary') as 'primary'
  return dropdown ? (
    <Icon
      path={dropdown === 'closed' ? mdiChevronDown : mdiChevronUp}
      size="16px"
      color={
        iconColor ??
        (disabled
          ? theme.palette.action.disabled
          : variant === 'outlined' || variant === 'text'
            ? theme.palette?.[colorAdj]?.main
            : theme.palette?.[colorAdj]?.contrastText)
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
            ? theme.palette?.[colorAdj]?.main
            : theme.palette?.[colorAdj]?.contrastText)
      }
      {...endIconProps}
    />
  ) : (
    endIcon
  )
}
