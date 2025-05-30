import {
  ListItemIcon,
  ListSubheader,
  MenuItem,
  MenuItemProps,
} from '@mui/material'
import { CTextField, CTextFieldProps } from './TextField'
import { Ref, useMemo } from 'react'
import uniq from 'lodash/uniq'
import Icon from '@mdi/react'

type SelectOption = {
  value: string | number | boolean
  label: string
  icon?: string
  iconRotate?: number
}

export type CSelect2Props = CTextFieldProps & {
  options: SelectOption[]
  groupBy?: (item: SelectOption) => string
  // onChange?: (newValue: string, e: ChangeEvent<HTMLInputElement>) => void
  slotProps?: CTextFieldProps['slotProps'] & {
    menuItem?: MenuItemProps
  }
  ref?: Ref<HTMLInputElement>
}

export const CSelect2 = (props: CSelect2Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { options, endIcon: _e, groupBy, ref, ...rest } = props
  const menuItemProps = rest?.slotProps?.menuItem

  const optionGroupNames = useMemo(() => {
    return groupBy ? uniq(options?.map?.((opt) => groupBy(opt)) ?? []) : null
  }, [groupBy, options])

  return (
    <CTextField {...rest} select ref={ref}>
      {optionGroupNames?.length && groupBy
        ? optionGroupNames.map((groupName, gIdx) => [
            <ListSubheader key={gIdx + '_list_header'}>
              {groupName}
            </ListSubheader>,
            options
              ?.filter((opt) => groupBy(opt) === groupName)
              .map((opt, oIdx) => (
                <MenuItem
                  value={opt?.value as string}
                  {...menuItemProps}
                  key={oIdx}
                >
                  {opt.label}
                </MenuItem>
              )),
          ])
        : options?.map((opt, oIdx) => (
            <MenuItem
              value={opt?.value as string}
              {...menuItemProps}
              key={oIdx}
            >
              {opt?.icon && (
                <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                  <Icon path={opt.icon} size={0.7} rotate={opt?.iconRotate} />
                </ListItemIcon>
              )}
              {opt.label}
            </MenuItem>
          ))}
    </CTextField>
  )
}
