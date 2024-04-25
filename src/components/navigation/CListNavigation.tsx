import Icon from '@mdi/react'
import { List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import { ListItemText, ListSubheader, alpha, useTheme } from '@mui/material'
import { ReactNode, useMemo } from 'react'

export type ListNavigationProps = {
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
}

export const ListNavigation = (props: ListNavigationProps) => {
  const { value, onChange, items, dense, disablePadding, subheader } = props

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
    >
      {items?.map((item, iIdx) => (
        <ListItem
          disablePadding
          style={item?.value === value ? activeBgColor : undefined}
        >
          <ListItemButton onClick={handleClicks[iIdx]}>
            {item?.icon && (
              <ListItemIcon>
                <Icon path={item?.icon as any} size={1} />
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
