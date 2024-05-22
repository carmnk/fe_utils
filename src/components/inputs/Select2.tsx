import { MenuItem, MenuItemProps } from '@mui/material'
import CTextField, { CTextFieldProps } from './TextField'

export type CSelect2Props = CTextFieldProps & {
  options: { value: string | number | boolean; label: string }[]
  // onChange?: (newValue: string, e: React.ChangeEvent<HTMLInputElement>) => void
  slotProps?: CTextFieldProps['slotProps'] & {
    menuItem?: MenuItemProps
  }
}

export const CSelect2 = (props: CSelect2Props) => {
  const { options, endIcon: _e, ...rest } = props
  const menuItemProps = rest?.slotProps?.menuItem
  return (
    <CTextField {...rest} select>
      {options?.map((opt, oIdx) => (
        <MenuItem value={opt?.value as any} {...menuItemProps} key={oIdx}>
          {opt.label}
        </MenuItem>
      ))}
    </CTextField>
  )
}
