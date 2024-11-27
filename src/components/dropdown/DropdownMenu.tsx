import { Menu, MenuProps, PaperProps } from '@mui/material'
import { DropDownMenuItemProps, DropdownMenuItem } from './DropdownMenuItem'
import { PropsWithChildren, useMemo } from 'react'

export type DropdownMenuProps = Omit<MenuProps, 'slotProps'> & {
  id?: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: (e?: unknown) => void
  items?: DropDownMenuItemProps[] // Dropdown menu items - precendence over children (but children can by any ReactNode, though consider the <DropwdownMenu/> css styles)
  slotProps?: Omit<MenuProps['slotProps'], 'paper'> & {
    transitionContainer?: MenuProps['TransitionProps']
    menuList?: MenuProps['MenuListProps']
    dropDownMenuItem?: DropDownMenuItemProps
    paper?: PaperProps
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
// const defaultSlotProps = { paper: { sx: { borderRadius: 1 } } }

export const DropdownMenu = (props: PropsWithChildren<DropdownMenuProps>) => {
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
          ...(slotPropsIn?.paper?.sx ?? {}),
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
            component={typeof item?.label !== 'string' ? 'div' : undefined}
            key={iIdx}
            {...(slotPropsIn?.dropDownMenuItem ?? {})}
            {...item}
          />
        )) ?? children}
      </Menu>
    )
  )
}
