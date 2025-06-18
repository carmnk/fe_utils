import { IconProps } from '@mdi/react/dist/IconProps'
import { List, TypographyProps, TypographyVariant } from '@mui/material'
import { ListItemButtonProps, ListItemIconProps } from '@mui/material'
import { ListItemProps, ListItemTextProps, ListProps } from '@mui/material'
import { ListSubheader } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { CListItem } from './CListItem'

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
    // listItem = {},
    // listItemButton = {},
    // listItemIconRoot = {},
    // listItemIcon = {},
    // listItemTextContainer = {},
    listItemTextPrimaryTypography = {},
    listItemTextSecondaryTypography = {},
  } = slotProps ?? {}

  const subheaderComponent = useMemo(() => {
    return subheader ? <ListSubheader>{subheader}</ListSubheader> : undefined
  }, [subheader])

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
        return (
          <CListItem
            item={item}
            itemIdx={iIdx}
            slotProps={slotProps}
            selectedValue={value}
            onChange={onChange}
            listItemTextSlotProps={listItemTextSlotProps}
            disablePadding={!!disablePadding}
          />
        )
      })}
      {rootInjection}
    </List>
  )
}
