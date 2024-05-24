import { useCallback, useState } from 'react'
import { GenericInputField } from './GenericInputField'
import { GenericInputFieldProps, InputFieldType } from './types'
import {
  Box,
  BoxProps,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from '@mui/material'
import { Flex, FlexProps } from '../_wrapper'
import { Button, CButtonProps } from '../buttons'
import { mdiDelete, mdiPlus } from '@mdi/js'

export type GenericArrayFieldProps<FieldType extends InputFieldType> = Omit<
  GenericInputFieldProps<FieldType>,
  'value'
> & {
  value: Array<GenericInputFieldProps<FieldType>['value']>
  slotProps?: GenericArrayFieldProps<FieldType>['slotProps'] & {
    arrayContainer?: BoxProps
    outerInputFlex?: FlexProps
    outerInputAddButton?: CButtonProps

    itemsContainer?: StackProps
    itemFlex?: FlexProps
    itemTypography?: TypographyProps
    itemDeleteButton?: CButtonProps
  }
}

export const GenericArrayField = <
  FieldType extends InputFieldType = InputFieldType,
>(
  props: GenericArrayFieldProps<FieldType>
) => {
  const { value, onChange, name, slotProps, disabled, ...rest } = props
  const {
    arrayContainer,
    itemsContainer,
    outerInputFlex,
    itemFlex,
    itemTypography,
    itemDeleteButton,
    outerInputAddButton,
    ...inputFieldSlotProps
  } = slotProps ?? {}

  const [newValue, setNewValue] = useState<any>('')

  const handleChangeNewValue = useCallback((newValue: any) => {
    setNewValue(newValue)
  }, [])

  const handleAddItem = useCallback(
    (newValue: any) => {
      onChange([...value, newValue] as never, name as any)
    },
    [name, onChange, value]
  )

  const handleKeyUp = useCallback(
    (e: any) => {
      if (e.key === 'Enter') {
        handleAddItem(newValue)
      }
    },
    [newValue, handleAddItem]
  )

  const handleRemoveItem = useCallback(
    (idx: number) => {
      onChange(value.filter((_, vIdx) => vIdx !== idx) as never, name as any)
    },
    [name, onChange, value]
  )

  return (
    <Box {...arrayContainer}>
      <Flex alignItems="center" gap={2} {...outerInputFlex}>
        <GenericInputField<FieldType>
          {...(rest as any)}
          value={newValue}
          onChange={!disabled && handleChangeNewValue}
          onKeyUp={!disabled && handleKeyUp}
          name={name}
          endIcon
          slotProps={inputFieldSlotProps}
          disabled={disabled}
          {...outerInputAddButton}
        />
        <Button
          icon={mdiPlus}
          iconButton
          onClick={handleAddItem}
          disabled={disabled}
        />
      </Flex>
      <Stack {...itemsContainer}>
        {value?.map?.((val, vIdx) => (
          <Flex alignItems="center" gap={2} key={vIdx} {...itemFlex}>
            <Typography {...itemTypography}>{val}</Typography>
            <Button
              icon={mdiDelete}
              iconButton
              onClick={() => handleRemoveItem(vIdx)}
              disabled={disabled}
              {...itemDeleteButton}
            />
          </Flex>
        ))}
      </Stack>
    </Box>
  )
}
