import { BoxProps, Divider, DividerProps, useTheme } from '@mui/material'
import { ReactNode, useCallback } from 'react'
import { Button, CButtonProps } from '../Button/Button'
import { Flex, FlexProps } from '../../_wrapper'

export type ButtonGroupProps = {
  items?: (
    | (CButtonProps & {
        value: string
        isInitialValue?: boolean
      })
    | null
  )[]
  value: string
  gap?: BoxProps['gap']
  buttonProps?: Omit<CButtonProps, 'icon' | 'tooltip' | 'label'>
  selectedButtonProps?: CButtonProps
  onChange: (value: string) => void
  isSelected?: (itemValue: string, groupValue: string) => boolean
  transformValue?: (newItemValue: string, currentGroupValue: string) => string
  iconButtons?: boolean
  slotProps?: {
    flexContainer?: FlexProps
    selectedButtonSlotProps?: CButtonProps['slotProps'] & {
      button: CButtonProps
    }
    buttonSlotProps?: CButtonProps['slotProps'] & { button: CButtonProps }
    divider?: DividerProps
  }
  rootInjection?: ReactNode
  color?: CButtonProps['color']
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
    rootInjection,
    gap,
    color,
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
      gap={gap}
      border={'1px solid ' + theme.palette.divider}
      width="max-content"
      position="relative"
      {...(slotProps?.flexContainer ?? {})}
    >
      {itemsAdj?.map?.((item, bIdx) => {
        const isItemSelected =
          (item && isSelected?.(item.value, value)) ?? item?.value === value
        return item ? (
          <Button
            slotProps={
              isItemSelected
                ? slotProps?.selectedButtonSlotProps
                : slotProps?.buttonSlotProps
            }
            variant={
              isItemSelected ? 'contained' : (buttonProps?.variant ?? 'text')
            }
            color={color}
            {...((isItemSelected
              ? (selectedButtonProps ??
                slotProps?.selectedButtonSlotProps?.button)
              : (buttonProps ?? slotProps?.buttonSlotProps?.button)) ?? {})}
            {...(item ?? {})}
            iconButton={item?.iconButton ?? iconButtons}
            key={bIdx}
            // selected={isItemSelected}
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
      {rootInjection}
    </Flex>
  )
}
