import { CSSProperties, ReactNode, Ref } from 'react'
import { useMemo } from 'react'
import {
  useTheme,
  Button as MuiButton,
  Box,
  StackProps,
  CircularProgressProps,
  TooltipProps,
} from '@mui/material'
import { Tooltip, Typography, TypographyProps } from '@mui/material'
import { ButtonProps } from '@mui/material'
import type { ButtonDropdown } from './defs'
import { ButtonEndIcon, ButtonStartIcon } from './ButtonIcons'
import { makeButtonStyles } from './buttonStyles'
import { IconProps } from '@mdi/react/dist/IconProps'

export type CButtonProps = Omit<
  ButtonProps,
  'label' | 'loading' | 'icon' | 'color' | 'slotProps' | 'endIcon'
> & {
  label?: ReactNode // label for the button - precedence over children!
  children?: ReactNode // label for the button - if label is not provided
  loading?: boolean // loading state (show spinner instead of icon)
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
  title?: string // title attribute (html)
  name?: string // name attribute (html)
  disabled?: boolean // disabled attribute
  disableTooltipWhenDisabled?: boolean
  disableInteractiveTooltip?: boolean // will directly close not wait for hover
  // typographyProps?: TypographyProps // props for the typography component inside the button
  slotProps?: {
    typography?: Partial<TypographyProps>
    tooltip?: Partial<TooltipProps>
    startIcon?: Partial<IconProps>
    endIcon?: Partial<IconProps>
    loadingIconContainer?: Partial<StackProps>
    loadingProgress?: Partial<CircularProgressProps>
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
    ref,
    ...rest
  } = props
  const {
    typography,
    startIcon,
    endIcon,
    loadingIconContainer,
    loadingProgress,
    tooltip,
  } = slotProps ?? {}
  const theme = useTheme()
  const disabled = disabledIn || loading

  const startIconComponent = useMemo(
    () => (
      <ButtonStartIcon
        icon={icon}
        iconColor={iconColor}
        iconSize={iconSize}
        disabled={disabled}
        loading={loading}
        variant={variant}
        startIconProps={startIcon}
        loadingIconContainerProps={loadingIconContainer}
        loadingProgressProps={loadingProgress}
        iconButton={iconButton}
      />
    ),
    [
      icon,
      iconColor,
      iconSize,
      disabled,
      loading,
      variant,
      startIcon,
      loadingIconContainer,
      loadingProgress,
      iconButton,
    ]
  )
  const endIconComponent = useMemo(
    () => ({
      endIcon: (
        <ButtonEndIcon
          disabled={disabled}
          endIcon={endIconIn}
          iconColor={iconColor}
          variant={variant}
          dropdown={dropdown}
          endIconProps={endIcon}
        />
      ),
    }),
    [disabled, endIconIn, iconColor, variant, dropdown, endIcon]
  )

  const buttonStyles = useMemo(
    () =>
      makeButtonStyles({
        theme,
        variant,
        disableHover,
        disabled,
        icon,
        iconButton,
        sx: rest?.sx,
        dropdown: dropdown,
        endIcon: endIconIn,
        borderRadius,
        fullWidth: props?.fullWidth,
      }),
    [
      theme,
      variant,
      disableHover,
      disabled,
      icon,
      iconButton,
      rest?.sx,
      dropdown,
      endIconIn,
      borderRadius,
      props?.fullWidth,
    ]
  )

  const Button = useMemo(
    () =>
      variant === 'outlined' ? (
        <MuiButton
          color={color}
          ref={ref}
          variant="outlined"
          disableElevation
          startIcon={startIconComponent}
          {...endIconComponent}
          disabled={disabled}
          {...rest}
          tabIndex={disableTabstop ? -1 : 0}
          sx={buttonStyles}
        >
          {!iconButton && (
            <Typography
              variant="body2"
              color={
                disabled ? 'action.disabled' : (fontColor ?? 'text.primary')
              }
              fontWeight={700}
              {...typography}
            >
              {label ?? children}
            </Typography>
          )}
          {rootInjection}
        </MuiButton>
      ) : variant === 'text' ? (
        <MuiButton
          color={color}
          ref={ref}
          size="small"
          variant="text"
          startIcon={startIconComponent}
          {...endIconComponent}
          disabled={disabled}
          {...rest}
          tabIndex={disableTabstop ? -1 : 0}
          sx={buttonStyles}
        >
          {!iconButton && (
            <Typography
              variant="body2"
              color={
                disabled ? 'action.disabled' : (fontColor ?? 'text.primary')
              }
              fontWeight={700}
              {...typography}
            >
              {label ?? children}
            </Typography>
          )}
          {rootInjection}
        </MuiButton>
      ) : (
        <MuiButton
          color={color}
          ref={ref}
          variant="contained"
          disableElevation
          startIcon={startIconComponent}
          {...endIconComponent}
          disabled={disabled}
          {...rest}
          tabIndex={disableTabstop ? -1 : 0}
          sx={buttonStyles}
        >
          {!iconButton && (
            <Typography
              variant="body2"
              color={
                disabled
                  ? 'action.disabled'
                  : (fontColor ?? 'primary.contrastText')
              }
              fontWeight={700}
              {...typography}
            >
              {label ?? children}
            </Typography>
          )}
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
      fontColor,
      label,
      startIconComponent,
      variant,
      buttonStyles,
      ref,
      typography,
      rest, // could be a problem
      rootInjection,
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
          <Box width="max-content">{Button}</Box>
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
    ]
  )
  return ButtonWithTooltip
}
