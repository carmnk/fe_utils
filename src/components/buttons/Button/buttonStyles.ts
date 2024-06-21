import { BoxProps, Theme } from '@mui/material'
import { CButtonProps } from './Button'

export const makeButtonStyles = (
  props: Pick<
    CButtonProps,
    | 'fullWidth'
    | 'variant'
    | 'disableHover'
    | 'iconButton'
    | 'icon'
    | 'dropdown'
    | 'sx'
    | 'disabled'
    | 'endIcon'
    | 'borderRadius'
  > & {
    theme: Theme
  }
): BoxProps['sx'] => {
  const {
    theme,
    disableHover,
    sx,
    iconButton,
    dropdown,
    variant,
    icon,
    endIcon,
    borderRadius,
    fullWidth,
  } = props

  const padding = iconButton ? '4px' : variant === 'text' ? '4px 16px' : 'auto'
  const commonStyles: Required<BoxProps['sx']> = {
    borderRadius,
    minWidth: 0,
    textTransform: 'none',
    display: 'flex',
    justifyContent: iconButton ? 'center' : 'flex-start',
    height: iconButton ? 28 : 'auto',
    padding,
    boxShadow: 'none',
    '& .MuiButton-startIcon': {
      ml: iconButton ? 'auto' : 0,
      mr: !icon ? 0 : iconButton ? 'auto' : '8px',
    },
    '& .MuiButton-endIcon': {
      display: !endIcon && !dropdown ? 'none' : 'inherit',
      ml: 'auto',
      pl: '5px',
    },
    width: fullWidth
      ? '100%'
      : iconButton && dropdown
        ? 53
        : iconButton
          ? 28
          : 'auto',
    pr: iconButton && dropdown ? 1 : undefined,
  }
  // const secondaryBgColor =
  //   theme.palette.mode === 'light'
  //     ? !disabled
  //       ? secondaryGrayColor.light.background
  //       : secondaryGrayColor.light.disabled
  //     : !disabled
  //       ? secondaryGrayColor.dark.background
  //       : secondaryGrayColor.dark.disabled

  const disableHoverStyles = disableHover
    ? {
        background: 'transparent',
        '&: hover': {
          background: 'transparent',
        },
      }
    : {}

  return variant === 'outlined'
    ? {
        ...commonStyles,
        // border: '0px solid ' + theme.palette.primary.main + ' !important',
        // background: secondaryBgColor,
        // '&: hover': {
        //   border: '0px solid ' + theme.palette.primary.main,
        //   background:
        //     theme.palette.mode === 'light'
        //       ? secondaryGrayColor.light.hover
        //       : secondaryGrayColor.dark.hover,
        // },
        padding,
        ...(sx ?? {}),
      }
    : variant === 'text'
      ? {
          ...commonStyles,
          background: 'transparent',
          '&: hover': {
            border: '0px solid ' + theme.palette.primary.main,
            background: disableHover
              ? 'transparent'
              : theme.palette.mode === 'light'
                ? '#E1E1E1'
                : '#999',
          },
          ...disableHoverStyles,
          padding,
          ...(sx ?? {}),
        }
      : {
          ...commonStyles,
          '&: hover': {
            boxShadow: 'none',
          },
          ...(sx ?? {}),
        }
}
