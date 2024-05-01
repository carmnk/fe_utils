import { ReactNode, useCallback } from 'react'
import {
  BottomNavigationAction,
  BottomNavigationActionProps,
} from '@mui/material'
import { BottomNavigation as MBottomNavigation } from '@mui/material'
import { BottomNavigationProps as MBottomNavigationProps } from '@mui/material'
import Icon from '@mdi/react'
import { mdiInformation } from '@mdi/js'

export type CBottomNavigationProps = MBottomNavigationProps & {
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
}

export const BottomNavigation = (props: CBottomNavigationProps) => {
  const { value, onChange, items, showLabels } = props

  const handleChangeItem = useCallback(
    (e: any, newValue: string) => {
      onChange(newValue)
    },
    [onChange]
  )
  return (
    <MBottomNavigation
      showLabels={showLabels ?? true}
      value={value}
      onChange={handleChangeItem}
    >
      {items?.map((item) => {
        return (
          <BottomNavigationAction
            value={item.value}
            label={item.label}
            icon={<Icon path={item?.icon ?? mdiInformation} size={1} />}
          />
        )
      })}
    </MBottomNavigation>
  )
}
