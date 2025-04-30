import { CSSProperties, ReactNode, Ref } from 'react'
import { useMemo } from 'react'
import { useTheme, Button as MuiButton, Box, TooltipProps } from '@mui/material'
import { Tooltip } from '@mui/material'
import { ButtonProps } from '@mui/material'
import type { ButtonDropdown } from './defs'
import { ButtonEndIcon, ButtonStartIcon } from './ButtonIcons'
import { makeButtonStyles } from './buttonStyles'
import { IconProps } from '@mdi/react/dist/IconProps'
import { mdiMinus } from '@mdi/js'

export type CButtonProps = Omit<
  ButtonProps,
  'label' | 'loading' | 'icon' | 'color' | 'slotProps' | 'endIcon'
> & {
  label?: ReactNode // label for the button - precedence over children!
  children?: ReactNode // label for the button - if label is not provided
  loading?: boolean // loading state (show spinner instead of icon)
  loadingMode?: 'auto' | 'leftPlaceholder' | 'rightPlaceholder'
  icon?: ReactNode
  endIcon?: ReactNode
  dropdown?: ButtonDropdown
  iconButton?: boolean
  disableHover?: boolean
  tooltip?: ReactNode
  color?: ButtonProps['color']
  iconColor?: string
  fontColor?: string
  iconSize?: CSSProperties['fontSize']
  disableTabstop?: boolean // if true, the button will not be focusable/tabable (tabindex=-1)
  disabled?: boolean // disabled attribute
  disableTooltipWhenDisabled?: boolean
  disableInteractiveTooltip?: boolean // will directly close not wait for hover
  // typographyProps?: TypographyProps // props for the typography component inside the button
  slotProps?: {
    tooltip?: Partial<TooltipProps>
    startIcon?: Partial<IconProps>
    endIcon?: Partial<IconProps>
  }
  borderRadius?: CSSProperties['borderRadius']
  rootInjection?: ReactNode
  ref?: Ref<HTMLButtonElement>
}

export const Button = (props: CButtonProps) => {
  const {
    icon,
    variant,
    label,
    disableHover,
    children,
    endIcon: endIconIn,
    loading,
    loadingMode,
    dropdown,
    disabled: disabledIn,
    iconButton,
    iconSize,
    color,
    iconColor,
    fontColor,
    disableTabstop,
    disableInteractiveTooltip,
    disableTooltipWhenDisabled,
    slotProps,
    borderRadius,
    rootInjection,
    disableElevation = true,
    ref,
    ...rest
  } = props

  const { startIcon, endIcon, tooltip } = slotProps ?? {}

  const theme = useTheme()
  const disabled = disabledIn || loading

  const startIconComponent = useMemo(
    () =>
      (icon ||
        (loading && ['leftPlaceholder'].includes(loadingMode ?? ''))) && (
        <ButtonStartIcon
          icon={!icon ? mdiMinus : icon}
          iconColor={iconColor}
          iconSize={iconSize}
          disabled={disabled}
          variant={variant}
          startIconProps={startIcon}
          color={color}
          // iconButton={iconButton}
        />
      ),
    [
      icon,
      iconColor,
      iconSize,
      disabled,
      variant,
      startIcon,
      loadingMode,
      loading,
      color,
    ]
  )
  const endIconComponent = useMemo(
    () =>
      (endIconIn ||
        (loading && ['rightPlaceholder'].includes(loadingMode ?? ''))) && (
        <ButtonEndIcon
          disabled={disabled}
          endIcon={!endIconIn ? mdiMinus : endIconIn}
          iconColor={iconColor}
          variant={variant}
          dropdown={dropdown}
          endIconProps={endIcon}
          color={color}
        />
      ),
    [
      disabled,
      endIconIn,
      iconColor,
      variant,
      dropdown,
      endIcon,
      color,
      loading,
      loadingMode,
    ]
  )

  const buttonStyles = useMemo(
    () =>
      makeButtonStyles({
        theme,
        variant,
        disableHover,
        iconButton,
        sx: rest?.sx,
        dropdown: dropdown,
        endIcon: endIconIn,
        borderRadius,
        fullWidth: props?.fullWidth,
        size: props?.size ?? 'medium',
        fontColor,
        color,
      }),
    [
      theme,
      variant,
      disableHover,
      iconButton,
      rest?.sx,
      dropdown,
      endIconIn,
      borderRadius,
      props?.fullWidth,
      props?.size,
      fontColor,
      color,
    ]
  )

  const Button = useMemo(
    () =>
      variant === 'outlined' ? (
        <MuiButton
          color={color}
          ref={ref}
          variant="outlined"
          startIcon={startIconComponent}
          endIcon={endIconComponent}
          disabled={disabled}
          {...rest}
          tabIndex={disableTabstop ? -1 : undefined}
          sx={buttonStyles}
          loading={loading}
          loadingPosition={
            startIconComponent && loadingMode !== 'rightPlaceholder'
              ? 'start'
              : endIconComponent && loadingMode !== 'leftPlaceholder'
                ? 'end'
                : loadingMode === 'leftPlaceholder'
                  ? 'start'
                  : loadingMode === 'rightPlaceholder'
                    ? 'end'
                    : 'center'
          }
          disableElevation={disableElevation}
        >
          {!iconButton && (label ?? children)}
          {rootInjection}
        </MuiButton>
      ) : variant === 'text' ? (
        <MuiButton
          color={color}
          ref={ref}
          variant="text"
          startIcon={startIconComponent}
          endIcon={endIconComponent}
          disabled={disabled}
          {...rest}
          tabIndex={disableTabstop ? -1 : undefined}
          sx={buttonStyles}
          loading={loading}
          loadingPosition={
            startIconComponent && loadingMode !== 'rightPlaceholder'
              ? 'start'
              : endIconComponent && loadingMode !== 'leftPlaceholder'
                ? 'end'
                : loadingMode === 'leftPlaceholder'
                  ? 'start'
                  : loadingMode === 'rightPlaceholder'
                    ? 'end'
                    : 'center'
          }
          disableElevation={disableElevation}
        >
          {!iconButton && (label ?? children)}
          {rootInjection}
        </MuiButton>
      ) : (
        <MuiButton
          color={color}
          ref={ref}
          variant="contained"
          startIcon={startIconComponent}
          endIcon={endIconComponent}
          disabled={disabled}
          {...rest}
          tabIndex={disableTabstop ? -1 : undefined}
          sx={buttonStyles}
          loading={loading}
          loadingPosition={
            startIconComponent && loadingMode !== 'rightPlaceholder'
              ? 'start'
              : endIconComponent && loadingMode !== 'leftPlaceholder'
                ? 'end'
                : loadingMode === 'leftPlaceholder'
                  ? 'start'
                  : loadingMode === 'rightPlaceholder'
                    ? 'end'
                    : 'center'
          }
          disableElevation={disableElevation}
        >
          {!iconButton && (label ?? children)}
          {rootInjection}
        </MuiButton>
      ),
    [
      color,
      disableTabstop,
      iconButton,
      children,
      disabled,
      endIconComponent,
      label,
      startIconComponent,
      variant,
      buttonStyles,
      ref,
      rest, // could be a problem
      rootInjection,
      loading,
      loadingMode,
      disableElevation,
    ]
  )

  const ButtonWithTooltip = useMemo(
    () =>
      props.tooltip ? (
        <Tooltip
          arrow={true}
          placement={'top'}
          title={disableTooltipWhenDisabled && disabled ? '' : props.tooltip}
          disableInteractive={disableInteractiveTooltip}
          {...tooltip}
        >
          <Box
            width={rest?.fullWidth ? '100%' : 'max-content'}
            bgcolor="transparent"
          >
            {Button}
          </Box>
        </Tooltip>
      ) : (
        Button
      ),
    [
      Button,
      props.tooltip,
      disableInteractiveTooltip,
      disabled,
      disableTooltipWhenDisabled,
      tooltip,
      rest?.fullWidth,
    ]
  )
  return ButtonWithTooltip
}
