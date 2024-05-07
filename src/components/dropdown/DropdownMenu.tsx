import { Menu, MenuProps } from '@mui/material'
import { DropDownMenuItemProps, DropdownMenuItem } from './DropdownMenuItem'
import { useMemo } from 'react'

export type DropdownMenuProps = Omit<MenuProps, 'slotProps'> & {
  id?: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  items?: DropDownMenuItemProps[] // Dropdown menu items - precendence over children (but children can by any ReactNode, though consider the <DropwdownMenu/> css styles)
  slotProps?: MenuProps['slotProps'] & {
    transitionContainer?: MenuProps['TransitionProps']
    menuList?: MenuProps['MenuListProps']
    dropDownMenuItem?: DropDownMenuItemProps
  }
  borderRadius?: number
}

const menuOrigins: Pick<MenuProps, 'anchorOrigin' | 'transformOrigin'> = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'right',
  },
}

const defaultMenuListProps = { sx: { pt: 0, pb: 0 } }
const defaultSlotProps = { paper: { sx: { borderRadius: 1 } } }

export const DropdownMenu = (
  props: React.PropsWithChildren<DropdownMenuProps>
) => {
  const {
    children,
    anchorEl,
    onClose,
    open,
    items,
    slotProps: slotPropsIn,
    borderRadius,
    ...rest
  } = props

  const menuListProps = useMemo(() => {
    return {
      ...defaultMenuListProps,
      ...(slotPropsIn?.menuList ?? {}),
    }
  }, [slotPropsIn?.menuList])

  const slotProps = useMemo(() => {
    return {
      ...slotPropsIn,
      paper: {
        ...(slotPropsIn?.paper ?? {}),
        sx: {
          ...((slotPropsIn?.paper as any)?.sx ?? {}),
          borderRadius: borderRadius ? borderRadius + 'px' : undefined,
        },
      },
    }
  }, [slotPropsIn, borderRadius])

  return (
    open && (
      <Menu
        disablePortal={false}
        open={!!open}
        anchorEl={anchorEl || undefined}
        onClose={onClose}
        {...menuOrigins}
        MenuListProps={menuListProps}
        TransitionProps={slotPropsIn?.transitionContainer}
        slotProps={slotProps}
        {...rest}
      >
        {items?.map?.((item, iIdx) => (
          <DropdownMenuItem
            key={iIdx}
            {...(slotPropsIn?.dropDownMenuItem ?? {})}
            {...item}
          />
        )) ?? children}
      </Menu>
    )
  )
}
