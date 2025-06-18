import {
  alpha,
  Divider,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemIconProps,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  SxProps,
  useTheme,
} from '@mui/material'
import { isThemeColor } from '../../html_editor/utils/isThemeColor'
import { Icon } from '@mdi/react'
import { useMemo } from 'react'
import { IconProps } from '@mdi/react/dist/IconProps'

export type CListItemProps = {
  selectedValue: string
  onChange: (newValue: string) => void
  disablePadding: boolean
  item: any
  itemIdx: number
  listItemTextSlotProps: any
  //   primaryTypographyVariant?: TypographyVariant
  //   secondaryTypographyVariant?: TypographyVariant
  //   primaryTypographyColor?: TypographyProps['color']
  //   secondaryTypographyColor?: TypographyProps['color']
  itemHoverBgColor?: string
  activeItemBgColor?: string
  activeItemHoverBgColor?: string
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
}

export const CListItem = (props: CListItemProps) => {
  const {
    item,
    itemIdx,
    slotProps,

    itemHoverBgColor,
    activeItemBgColor,
    activeItemHoverBgColor,
    selectedValue,
    disablePadding,
    onChange,
    listItemTextSlotProps,
  } = props
  const {
    listItem = {},
    listItemButton = {},
    listItemIcon = {},
    listItemIconRoot = {},
    listItemTextContainer = {},
    // listItemTextPrimaryTypography,
    // listItemTextSecondaryTypography,
  } = slotProps ?? {}

  const theme = useTheme()

  const activeBgColor = useMemo(() => {
    return {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    }
  }, [theme.palette])

  const itemHoverBgColorSx = useMemo(
    () =>
      itemHoverBgColor
        ? {
            '&:hover': {
              ...(listItem?.sx?.['&:hover' as keyof SxProps] ?? {}),
              backgroundColor: itemHoverBgColor,
            },
          }
        : {},
    [listItem?.sx, itemHoverBgColor]
  )
  const activeItemBgColorAdj = useMemo(
    () =>
      activeItemBgColor && isThemeColor(activeItemBgColor)
        ? theme.palette[activeItemBgColor.split('.')?.[0] as 'primary'][
            activeItemBgColor.split('.')?.[1] as 'main'
          ]
        : activeItemBgColor,
    [activeItemBgColor, theme]
  )
  const activeItemHoverBgColorAdj = useMemo(
    () =>
      activeItemHoverBgColor && isThemeColor(activeItemHoverBgColor)
        ? theme.palette[activeItemHoverBgColor.split('.')?.[0] as 'primary'][
            activeItemHoverBgColor.split('.')?.[1] as 'main'
          ]
        : activeItemHoverBgColor,
    [activeItemHoverBgColor, theme]
  )

  const activeListItemSx = useMemo(
    () =>
      (activeItemBgColor || activeItemHoverBgColor) &&
      item?.value === selectedValue
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
        : {},
    [
      activeItemBgColor,
      activeItemHoverBgColor,
      item,
      selectedValue,
      listItem?.sx,
      activeItemHoverBgColorAdj,
      activeItemBgColorAdj,
    ]
  )
  const listItemProps = useMemo(
    () => ({
      disablePadding,
      style: item?.value === selectedValue ? activeBgColor : undefined,
      ...listItem,
      sx: {
        ...(listItem?.sx ?? {}),
        ...(itemHoverBgColorSx ?? {}),
        ...(activeListItemSx ?? {}),
      },
    }),
    [
      item?.value,
      selectedValue,
      activeBgColor,
      listItem,
      itemHoverBgColorSx,
      activeListItemSx,
      disablePadding,
    ]
  )
  const listItemButtonProps = useMemo(
    () => ({
      onClick: () => onChange?.(item.value),
      ...listItemButton,
      sx: {
        ...(listItemButton?.sx ?? {}),
        '&:hover': {
          ...(listItemButton?.sx?.['&:hover' as keyof SxProps] ?? {}),
          backgroundColor: 'transparent !important',
        },
      },
    }),
    [onChange, item?.value, listItemButton]
  )

  console.log(
    'ListNavigation ITEM inside',
    props,
    item,
    'item-props',
    listItemProps,
    listItemButtonProps,
    listItemIconRoot,
    listItemTextContainer,
    listItemTextSlotProps,
    listItemIcon
  )

  return item ? (
    <ListItem {...listItemProps} key={itemIdx}>
      <ListItemButton {...listItemButtonProps} disabled={item?.disabled}>
        {typeof item?.icon === 'string' && (
          <ListItemIcon {...listItemIconRoot}>
            <Icon path={item?.icon as string} size={1} {...listItemIcon} />
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
    <Divider key={itemIdx} />
  )
}
