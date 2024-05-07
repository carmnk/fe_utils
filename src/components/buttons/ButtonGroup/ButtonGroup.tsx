import { Divider, DividerProps, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { ButtonGroupButton, ButtonGroupButtonProps } from './ButtonGroupButton'
import { CButtonProps } from '../Button/Button'
import { Flex, FlexProps } from '../../_wrapper'

export type ButtonGroupProps = {
  items?: (
    | (Omit<ButtonGroupButtonProps, 'selected'> & {
        value: string
      })
    | null
  )[]
  value: string
  buttonProps?: Omit<CButtonProps, 'icon' | 'tooltip' | 'label'>
  selectedButtonProps?: CButtonProps
  onChange: (value: string) => void
  isSelected?: (itemValue: string, groupValue: string) => boolean
  transformValue?: (newItemValue: string, currentGroupValue: string) => string
  iconButtons?: boolean
  slotProps?: {
    flexContainer?: FlexProps
    selectedButtonSlots?: CButtonProps['slotProps']
    buttonSlots?: CButtonProps['slotProps']
    divider?: DividerProps
  }
}

export const ButtonGroup = (props: ButtonGroupProps) => {
  const {
    items,
    value,
    onChange,
    isSelected,
    transformValue,
    buttonProps,
    selectedButtonProps,
    iconButtons,
    slotProps,
  } = props
  const itemsAdj = items

  const handleChange = useCallback(
    (newValue: string) => {
      if (!onChange) return
      const newValueAdj = transformValue
        ? transformValue(newValue, value)
        : newValue
      onChange(newValueAdj)
    },
    [onChange, transformValue, value]
  )

  const theme = useTheme()
  return (
    <Flex
      gap={0.25}
      border={'1px solid ' + theme.palette.divider}
      width="max-content"
      {...(slotProps?.flexContainer ?? {})}
    >
      {itemsAdj?.map?.((item, bIdx) => {
        const isItemSelected =
          (item && isSelected?.(item.value, value)) ?? item?.value === value
        return item ? (
          <ButtonGroupButton
            slotProps={
              isItemSelected
                ? slotProps?.selectedButtonSlots
                : slotProps?.buttonSlots
            }
            {...((isItemSelected ? selectedButtonProps : buttonProps) ?? {})}
            {...(item ?? {})}
            iconButton={item?.iconButton ?? iconButtons}
            key={bIdx}
            selected={isItemSelected}
            onClick={() => handleChange(item.value)}
          />
        ) : (
          <Divider
            orientation="vertical"
            flexItem
            key={bIdx}
            {...(slotProps?.divider ?? {})}
          />
        )
      }) ?? null}
    </Flex>
  )
}
