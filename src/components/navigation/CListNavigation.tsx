import Icon from '@mdi/react'
import { IconProps } from '@mdi/react/dist/IconProps'
import { List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import { ListItemButtonProps, ListItemIconProps } from '@mui/material'
import { ListItemProps, ListItemTextProps, ListProps } from '@mui/material'
import { ListItemText, ListSubheader, alpha, useTheme } from '@mui/material'
import { ReactNode, useMemo } from 'react'

export type ListNavigationProps = Omit<
  ListProps,
  'onChange' | 'value' | 'items'
> & {
  value: string
  onChange: (value: string) => void
  items: {
    value: string
    label: ReactNode
    tooltip?: string
    disabled?: boolean
    icon?: ReactNode
  }[]
  dense?: boolean
  disablePadding?: boolean
  subheader?: ReactNode
  slotProps?: {
    listItem?: ListItemProps
    listItemButton?: ListItemButtonProps
    listItemIconRoot?: ListItemIconProps
    listItemIcon?: IconProps
    listItemTextRoot?: ListItemTextProps
    listItemTextPrimaryTypography?: ListItemTextProps['primaryTypographyProps']
    listItemTextSecondaryTypography?: ListItemTextProps['secondaryTypographyProps']
    touchRipple?: ListItemButtonProps['TouchRippleProps']
  }
  rootInjection?: ReactNode
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
    ...others
  } = props

  const {
    listItem,
    listItemButton,
    listItemIconRoot,
    listItemIcon,
    listItemTextRoot,
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
    return items.map((item) => () => {
      onChange(item.value)
    })
  }, [items, onChange])

  return (
    <List
      dense={dense}
      disablePadding={disablePadding}
      subheader={subheaderComponent}
      {...others}
    >
      {items?.map((item, iIdx) => (
        <ListItem
          disablePadding
          style={item?.value === value ? activeBgColor : undefined}
          key={iIdx}
          {...listItem}
        >
          <ListItemButton onClick={handleClicks[iIdx]} {...listItemButton}>
            {item?.icon && (
              <ListItemIcon {...listItemIconRoot}>
                <Icon path={item?.icon as string} size={1} {...listItemIcon} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={item.label}
              {...listItemTextRoot}
              primaryTypographyProps={listItemTextPrimaryTypography}
              secondaryTypographyProps={listItemTextSecondaryTypography}
            />
          </ListItemButton>
        </ListItem>
      ))}
      {rootInjection}
    </List>
  )
}
