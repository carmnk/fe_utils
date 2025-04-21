import { BoxProps, Theme } from '@mui/material'
import { CButtonProps } from './Button'

export const makeButtonStyles = (
  props: Pick<
    CButtonProps,
    | 'fullWidth'
    | 'variant'
    | 'disableHover'
    | 'iconButton'
    | 'dropdown'
    | 'sx'
    | 'endIcon'
    | 'borderRadius'
    | 'size'
    | 'fontColor'
    | 'color'
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
    size,
    endIcon,
    borderRadius,
    fullWidth,
    fontColor,
    color,
  } = props

  const iconButtonSizeRem =
    size === 'medium'
      ? '2rem'
      : size === 'large'
        ? '2.5rem'
        : size === 'small'
          ? '1.75rem'
          : undefined

  const padding = iconButton
    ? '0.25rem'
    : variant === 'text'
      ? '0.25rem 1rem'
      : 'auto'
  const commonStyles: Required<BoxProps['sx']> = {
    color: fontColor,
    borderRadius,
    minWidth: 0,
    textTransform: 'none',
    display: 'flex',
    justifyContent: iconButton ? 'center' : 'flex-start',
    height: iconButton ? iconButtonSizeRem : 'auto',
    padding,
    '& .MuiButton-startIcon': {
      mr: iconButton ? 'auto' : undefined,
      ml: iconButton ? 'auto' : undefined,
    },
    '& .MuiButton-endIcon': {
      ml: iconButton && endIcon ? '0px' : undefined,
    },
    width: fullWidth
      ? '100%'
      : iconButton && dropdown
        ? 53
        : iconButton
          ? iconButtonSizeRem
          : 'auto',
    pr: iconButton && dropdown ? 1 : undefined,
  }

  const disableHoverStyles =
    disableHover && ['outlined', 'text'].includes(variant ?? '')
      ? {
          background: 'transparent',
          '&: hover': {
            background: 'transparent',
          },
        }
      : disableHover && (!variant || variant === 'contained')
        ? {
            // background: color ?? 'primary',
            '&: hover': {
              background:
                theme.palette?.[(color ?? 'primary') as 'primary'].main +
                ' !important',
            },
          }
        : {}

  return variant === 'outlined'
    ? {
        ...commonStyles,
        padding,
        ...disableHoverStyles,
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
          ...disableHoverStyles,
          ...(sx ?? {}),
        }
}
