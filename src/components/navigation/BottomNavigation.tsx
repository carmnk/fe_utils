import { ReactNode, useCallback } from 'react'
import {
  BottomNavigationAction,
  BottomNavigationActionProps,
} from '@mui/material'
import { BottomNavigation as MBottomNavigation } from '@mui/material'
import { BottomNavigationProps as MBottomNavigationProps } from '@mui/material'
import Icon from '@mdi/react'
import { mdiInformation } from '@mdi/js'

export type CBottomNavigationProps = Omit<
  MBottomNavigationProps,
  'onChange'
> & {
  value: string
  onChange: (value: string) => void
  items: {
    value: string
    label: ReactNode
    tooltip?: string
    disabled?: boolean
    icon?: string
    sx?: BottomNavigationActionProps['sx']
  }[]
  showLabels?: boolean
  slotProps?: {
    bottomNavigation?: MBottomNavigationProps
    bottomNavigationSelectedAction?: BottomNavigationActionProps
    bottomNavigationAction?: BottomNavigationActionProps
  }
  sx?: MBottomNavigationProps['sx']
  rootInjection?: ReactNode
}

export const BottomNavigation = (props: CBottomNavigationProps) => {
  const { value, onChange, items, showLabels, rootInjection, sx } = props

  const handleChangeItem = useCallback(
    (e: unknown, newValue: string) => {
      onChange(newValue)
    },
    [onChange]
  )
  return (
    <MBottomNavigation
      showLabels={showLabels ?? true}
      value={value}
      onChange={handleChangeItem}
      sx={sx}
      {...(props.slotProps?.bottomNavigation ?? {})}
    >
      {items?.map((item) => {
        return (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            label={item.label}
            icon={<Icon path={item?.icon ?? mdiInformation} size={1} />}
            {...(item.value === value
              ? props.slotProps?.bottomNavigationSelectedAction
              : (props.slotProps?.bottomNavigationAction ?? {}))}
          />
        )
      })}
      {rootInjection}
    </MBottomNavigation>
  )
}
