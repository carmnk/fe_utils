import { Menu, MenuProps } from '@mui/material'
import { DropDownMenuItemProps, DropdownMenuItem } from './DropdownMenuItem'

export type DropdownMenuProps = {
  id?: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  items?: DropDownMenuItemProps[] // Dropdown menu items - precendence over children (but children can by any ReactNode, though consider the <DropwdownMenu/> css styles)
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

const menuListProps = { sx: { pt: 0, pb: 0 } }
const slotProps = { paper: { sx: { borderRadius: 1 } } }

export const DropdownMenu = (
  props: React.PropsWithChildren<DropdownMenuProps>
) => {
  const { children, anchorEl, onClose, open, items, id } = props
  // const stopPropagation = React.useCallback(
  //   (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //     onClose?.();
  //     e.stopPropagation();
  //   },
  //   [onClose]
  // );
  return (
    open && (
      <Menu
        id={id}
        disablePortal={false}
        open={!!open}
        anchorEl={anchorEl || undefined}
        onClose={onClose}
        {...menuOrigins}
        MenuListProps={menuListProps}
        slotProps={slotProps}
      >
        {items?.map?.((item, iIdx) => (
          <DropdownMenuItem key={iIdx} {...item} />
        )) ?? children}
      </Menu>
    )
  )
}
