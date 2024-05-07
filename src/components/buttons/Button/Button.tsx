import React, { CSSProperties, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
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

export type CButtonProps = Pick<
  ButtonProps,
  'onClick' | 'onPointerDown' | 'onKeyDown' | 'size' | 'sx' | 'id' | 'variant'
> & {
  label?: React.ReactNode // label for the button - precedence over children!
  children?: React.ReactNode // label for the button - if label is not provided
  loading?: boolean // loading state (show spinner instead of icon)
  icon?: React.ReactNode
  endIcon?: React.ReactNode
  dropdown?: ButtonDropdown
  iconButton?: boolean
  disableHover?: boolean
  tooltip?: string
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
    typography?: TypographyProps
    tooltip?: TooltipProps
    startIcon?: IconProps
    endIcon?: IconProps
    loadingIconContainer?: StackProps
    loadingProgress?: CircularProgressProps
  }
  borderRadius?: CSSProperties['borderRadius']
}

export const Button = React.forwardRef(
  (props: CButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
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
                  disabled ? 'action.disabled' : fontColor ?? 'text.primary'
                }
                fontWeight={700}
                {...typography}
              >
                {label ?? children}
              </Typography>
            )}
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
                  disabled ? 'action.disabled' : fontColor ?? 'text.primary'
                }
                fontWeight={700}
                {...typography}
              >
                {label ?? children}
              </Typography>
            )}
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
                    : fontColor ?? 'primary.contrastText'
                }
                fontWeight={700}
                {...typography}
              >
                {label ?? children}
              </Typography>
            )}
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
)
Button.displayName = 'Button'
