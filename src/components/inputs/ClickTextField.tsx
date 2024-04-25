import { mdiCheck, mdiDelete, mdiPencil } from '@mdi/js'
import {
  Stack,
  Typography,
  Box,
  ClickAwayListener,
  TypographyProps,
  TextField,
  TextFieldProps,
  Chip,
} from '@mui/material'
import React, { ChangeEvent, memo, useCallback, useState } from 'react'
import { Button } from '../buttons/Button/Button'
import { CAutoComplete, CAutoCompleteProps } from './AutoComplete'
import { ButtonType } from '../buttons/Button/defs'
import { TextArea } from './TextArea'
import {
  GenericInputField,
  GenericInputFieldProps,
  GenericInputFieldType,
} from './GenericInputField'

const inputStyles = { sx: { p: 0.5, px: 1 } }

type CommonClickTextFieldProps = {
  value: string
  typographyProps?: TypographyProps
  additionalLabelComponent?: React.ReactNode
  onChange?: (newValue: string) => void
  validateInput?: (newValue: string) => boolean
  onClickAway?: () => void
  handleRemoveItem?: () => void
  onToggle?: (isEdit: boolean) => void

  groupBy?: (option: any) => string
  useChip?: boolean
  deleteIcon?: string
  deleteIconTooltip?: string
  fullwidth?: boolean
  // common props
  disabled?: boolean
  placeholder?: string
  inputHelperText?: string
  inputError?: boolean
}

// type TextClickTextFieldProps = {
//   variant?: 'text' | 'textarea'
//   textFieldProps?: TextFieldProps
// }

// type AutoCompleteClickTextFieldProps = {
//   variant?: 'autocomplete'
//   options: { value: string; label: string }[]
//   autoCompleteProps?: CAutoCompleteProps
// }

export type ClickTextFieldProps<
  T extends GenericInputFieldType = GenericInputFieldType,
> = CommonClickTextFieldProps & {
  variant?: T
  fieldProps?: GenericInputFieldProps<T>
} & (T extends 'autocomplete' | 'select' | 'multiselect'
    ? { options: { value: string; label: string }[] }
    : object)

export const ClickTextFieldComponent = <
  InputType extends GenericInputFieldType = GenericInputFieldType,
>(
  props: ClickTextFieldProps<InputType>
) => {
  const {
    variant: variantIn,
    value,
    typographyProps,
    additionalLabelComponent,
    fieldProps,
    onChange,
    validateInput,
    onClickAway,
    handleRemoveItem,
    onToggle,
    disabled,
    placeholder,
    useChip,
    groupBy,
    deleteIcon,
    deleteIconTooltip,
    fullwidth,
    inputHelperText,
    inputError,
    options,
  } = props as ClickTextFieldProps<'select'>
  const variant = variantIn as InputType
  const [ui, setUi] = useState({ isEdit: false, tempValue: '' })

  const handleTakeover = useCallback(() => {
    setUi((current) => ({ ...current, isEdit: false, tempValue: '' }))
    onChange?.(ui?.tempValue)
  }, [ui?.tempValue, onChange])

  const handleToggleIsEdit = useCallback(() => {
    onToggle?.(!ui?.isEdit)
    setUi((current) => ({
      ...current,
      isEdit: !current.isEdit,
      tempValue: current.isEdit ? '' : value,
    }))
    if (ui?.isEdit) {
      onClickAway?.()
    }
  }, [ui?.isEdit, onClickAway, value, onToggle])

  const handleChangeTempValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e?.target?.value
      if (validateInput && !validateInput(newValue)) return
      setUi((current) => ({ ...current, tempValue: newValue }))
    },
    [validateInput]
  )

  const handleChangeTempSelectValue = useCallback(
    (newValue: string) => {
      //   const newValue = e?.target?.value;
      if (validateInput && !validateInput(newValue)) return
      setUi((current) => ({ ...current, tempValue: newValue }))
    },
    [validateInput]
  )

  const handleOnKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (variant === 'textarea') return
      if (e.key === 'Enter') {
        handleTakeover()
      }
    },
    [handleTakeover, variant]
  )

  return !ui?.isEdit || disabled ? (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      width={fullwidth ? '100%' : undefined}
    >
      {useChip ? (
        <Chip label={(value || placeholder) ?? ''} size="small" />
      ) : (
        <Typography
          color="text.primary"
          // variant="h6"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          variant="h5"
          fontStyle={!value && placeholder ? 'italic' : 'normal'}
          fontWeight={!value && placeholder ? 400 : 700}
          {...typographyProps}
          flexGrow={1}
        >
          {(value || placeholder) ?? ''}
        </Typography>
      )}
      {additionalLabelComponent}
      {!disabled && (
        <>
          <Box minWidth={24} minHeight={24}>
            <Button
              icon={mdiPencil}
              iconButton={true}
              type={ButtonType.text}
              onClick={handleToggleIsEdit}
            />
          </Box>
          {handleRemoveItem && (
            <Box minWidth={24} minHeight={24}>
              <Button
                icon={deleteIcon ?? mdiDelete}
                tooltip={deleteIconTooltip}
                iconButton={true}
                type={ButtonType.text}
                onClick={handleRemoveItem}
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  ) : (
    <ClickAwayListener onClickAway={handleToggleIsEdit}>
      <Stack direction="row" alignItems="center" gap={1}>
        <Box flexGrow={1}>
          {variant === 'autocomplete' ? (
            <CAutoComplete
              value={(ui?.tempValue as any) ?? ''}
              placeholder={placeholder}
              options={options}
              // value={ui.ruleValue}
              onChange={handleChangeTempSelectValue as any}
              size="small"
              sx={{ width: '140px' }}
              disableLabel={true}
              disableHelperText={true}
              onKeyUp={handleOnKeyUp}
              groupBy={groupBy}
              helperText={inputHelperText}
              error={inputError}
              {...(fieldProps as any)}
            />
          ) : (
            <GenericInputField
              type={variant ?? 'text'}
              placeholder={placeholder}
              size="small"
              // inputProps={inputStyles}
              onChange={(newValue: string | number, e: any) => {
                handleChangeTempValue(e)
              }}
              value={ui?.tempValue ?? ''}
              onKeyUp={handleOnKeyUp as any}
              helperText={inputHelperText}
              disableLabel // ?
              disableHelperText={!inputHelperText}
              error={inputError}
              {...(fieldProps as any)}
            />
          )}
        </Box>
        <Box minWidth={24} minHeight={24}>
          <Button
            icon={mdiCheck}
            iconButton={true}
            type={ButtonType.text}
            onClick={handleTakeover}
          />
        </Box>
      </Stack>
    </ClickAwayListener>
  )
}

export const ClickTextField = memo(ClickTextFieldComponent)
