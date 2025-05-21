import Icon from '@mdi/react'
import { IconProps } from '@mdi/react/dist/IconProps'
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  SxProps,
  TypographyProps,
  TypographyVariant,
} from '@mui/material'
import { ListItemButtonProps, ListItemIconProps } from '@mui/material'
import { ListItemProps, ListItemTextProps, ListProps } from '@mui/material'
import { ListItemText, ListSubheader, alpha, useTheme } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { isThemeColor } from '../../html_editor/editorComponents/components/Typography/TypographyWrapper'

export type ListNavigationProps = Omit<
  ListProps,
  'onChange' | 'value' | 'items'
> & {
  value: string
  onChange: (value: string) => void
  items: ({
    value: string
    secondaryLabel?: string
    label: ReactNode
    tooltip?: string
    disabled?: boolean
    icon?: ReactNode
    isInitialValue?: boolean
  } | null)[]
  dense?: boolean
  disablePadding?: boolean
  subheader?: ReactNode
  slotProps?: {
    listItem?: ListItemProps
    listItemButton?: ListItemButtonProps
    listItemIconRoot?: ListItemIconProps
    listItemIcon?: IconProps
    listItemTextContainer?: ListItemTextProps
    listItemTextPrimaryTypography?: ListItemTextProps['primaryTypographyProps']
    listItemTextSecondaryTypography?: ListItemTextProps['secondaryTypographyProps']
    touchRipple?: ListItemButtonProps['TouchRippleProps']
  }
  primaryTypographyVariant?: TypographyVariant
  secondaryTypographyVariant?: TypographyVariant
  primaryTypographyColor?: TypographyProps['color']
  secondaryTypographyColor?: TypographyProps['color']
  itemHoverBgColor?: string
  activeItemBgColor?: string
  activeItemHoverBgColor?: string
  rootInjection?: ReactNode
  background?: string
}

export const ListNavigation = (props: ListNavigationProps) => {
  const {
    value,
    onChange,
    items,
    dense,
    disablePadding,
    subheader,
    slotProps,
    rootInjection,
    primaryTypographyVariant,
    secondaryTypographyVariant,
    primaryTypographyColor,
    secondaryTypographyColor,
    itemHoverBgColor,
    activeItemBgColor,
    activeItemHoverBgColor,
    background,
    ...others
  } = props

  const {
    listItem,
    listItemButton,
    listItemIconRoot,
    listItemIcon,
    listItemTextContainer,
    listItemTextPrimaryTypography,
    listItemTextSecondaryTypography,
  } = slotProps ?? {}

  const theme = useTheme()
  const activeBgColor = useMemo(() => {
    return {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    }
  }, [theme.palette])

  const subheaderComponent = useMemo(() => {
    return subheader ? <ListSubheader>{subheader}</ListSubheader> : undefined
  }, [subheader])

  const handleClicks = useMemo(() => {
    return (
      items?.map?.((item) => () => {
        if (!item) return
        onChange(item.value)
      }) ?? []
    )
  }, [items, onChange])

  const listProps = useMemo(() => {
    return {
      dense,
      disablePadding,
      subheader: subheaderComponent,
      ...others,
      sx: {
        ...(others?.sx ?? {}),
        ...(background ? { backgroundColor: background } : {}),
      },
    }
  }, [dense, disablePadding, others, subheaderComponent, background])

  const listItemTextSlotProps = useMemo(() => {
    return {
      primary: {
        ...(listItemTextPrimaryTypography ?? {}),
        variant: primaryTypographyVariant,
        color: primaryTypographyColor,
      },
      secondary: {
        ...(listItemTextSecondaryTypography ?? {}),
        variant: secondaryTypographyVariant,
        color: secondaryTypographyColor,
      },
    }
  }, [
    listItemTextPrimaryTypography,
    listItemTextSecondaryTypography,
    primaryTypographyVariant,
    secondaryTypographyVariant,
    primaryTypographyColor,
    secondaryTypographyColor,
  ])

  return (
    <List {...listProps}>
      {items?.map?.((item, iIdx) => {
        const itemHoverBgColorSx = itemHoverBgColor
          ? {
              '&:hover': {
                ...(listItem?.sx?.['&:hover' as keyof SxProps] ?? {}),
                backgroundColor: itemHoverBgColor,
              },
            }
          : {}
        const activeItemBgColorAdj =
          activeItemBgColor && isThemeColor(activeItemBgColor)
            ? theme.palette[activeItemBgColor.split('.')?.[0] as 'primary'][
                activeItemBgColor.split('.')?.[1] as 'main'
              ]
            : activeItemBgColor
        const activeItemHoverBgColorAdj =
          activeItemHoverBgColor && isThemeColor(activeItemHoverBgColor)
            ? theme.palette[
                activeItemHoverBgColor.split('.')?.[0] as 'primary'
              ][activeItemHoverBgColor.split('.')?.[1] as 'main']
            : activeItemHoverBgColor
        const activeListItemSx =
          (activeItemBgColor || activeItemHoverBgColor) && item?.value === value
            ? {
                bgcolor: activeItemBgColorAdj
                  ? activeItemBgColorAdj + ' !important'
                  : undefined,
                '&:hover': {
                  ...(listItem?.sx?.['&:hover' as keyof SxProps] ?? {}),
                  backgroundColor: activeItemHoverBgColorAdj
                    ? activeItemHoverBgColorAdj + ' !important'
                    : undefined,
                },
              }
            : {}
        const listItemProps = {
          disablePadding,
          style: item?.value === value ? activeBgColor : undefined,
          ...listItem,
          sx: {
            ...(listItem?.sx ?? {}),
            ...(itemHoverBgColorSx ?? {}),
            ...(activeListItemSx ?? {}),
          },
        }
        const listItemButtonProps = {
          onClick: handleClicks[iIdx],
          ...listItemButton,
          sx: {
            ...(listItemButton?.sx ?? {}),
            '&:hover': {
              ...(listItemButton?.sx?.['&:hover' as keyof SxProps] ?? {}),
              backgroundColor: 'transparent !important',
            },
          },
        }
        return item ? (
          <ListItem {...listItemProps} key={iIdx}>
            <ListItemButton {...listItemButtonProps} disabled={item?.disabled}>
              {item?.icon && (
                <ListItemIcon {...listItemIconRoot}>
                  <Icon
                    path={item?.icon as string}
                    size={1}
                    {...listItemIcon}
                  />
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                secondary={item?.secondaryLabel}
                {...listItemTextContainer}
                slotProps={listItemTextSlotProps}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          <Divider key={iIdx} />
        )
      })}
      {rootInjection}
    </List>
  )
}
