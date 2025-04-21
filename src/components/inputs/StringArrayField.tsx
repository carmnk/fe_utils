import { mdiDeleteOutline } from '@mdi/js'
import { Box, Stack } from '@mui/material'
import { ChangeEvent, Fragment, ReactNode, useCallback } from 'react'
import { Button } from '../buttons/Button/Button'
import { CTextField } from './TextField'

export type StringArrayFieldProps = {
  value?: string[] | null
  label?: ReactNode
  name?: string
  required?: boolean
  error?: boolean
  onChangeArray: (newValue: string, name?: string) => void // index??
  onRemoveItem: (name: string | undefined, arrayIndex: number) => void
  enableDeleteFirst?: boolean
  // disableHelperText?: boolean
  disabled?: boolean
}

export const StringArrayField = (props: StringArrayFieldProps) => {
  const {
    value,
    label,
    error,
    required,
    name,
    onChangeArray,
    onRemoveItem,
    enableDeleteFirst,
    // showError,
    // disableHelperText,
    disabled,
  } = props
  const valueAdjusted = value?.length ? value : ['']

  const handleChange = useCallback(
    (_newValue: string, e?: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e?.target ?? {}
      if (!value) return
      onChangeArray(value, name)
    },
    [onChangeArray]
  )

  return (
    <Fragment>
      {valueAdjusted?.map((item, index) => (
        <Stack
          direction="row"
          mb={1}
          gap={1}
          alignItems="center"
          key={index}
          sx={{ overFlowX: 'visible' }}
        >
          <CTextField
            type="text"
            value={item}
            label={label}
            name={name}
            required={required && !index}
            onChange={handleChange}
            sx={{ width: '100%' }}
            error={error} //?? (required && !value && !index)}
            // disableHelperText={disableHelperText}
            disabled={disabled}
          />
          {(enableDeleteFirst || index > 0) && (
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                paddingTop: 0, // disableHelperText ? '24px' : 0,
              }}
            >
              <Button
                variant="text"
                iconButton={true}
                icon={mdiDeleteOutline}
                title={'delete_' + index}
                data-testid={'delete_' + index}
                tooltip="Eintrag löschen"
                onClick={() => onRemoveItem(name, index)}
              />
            </Box>
          )}
        </Stack>
      )) ?? null}
    </Fragment>
  )
}
