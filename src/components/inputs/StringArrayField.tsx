import { mdiDeleteOutline } from '@mdi/js'
import { Box, Stack } from '@mui/material'
import { Fragment } from 'react'
import { Button } from '../buttons/Button/Button'
import { TextField } from './TextField'
import { ButtonType } from '../buttons/Button/defs'

export type StringArrayFieldProps = {
  value?: string[] | null
  label?: React.ReactNode
  name?: string
  required?: any
  error?: boolean
  onChangeArray: (newValue: string, name: string, arrayIdx: number) => void
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

  console.error('valueAdjusted', valueAdjusted)
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
          <TextField
            type="text"
            value={item}
            label={label}
            name={name}
            required={required && !index}
            onChange={(newValue, e) => {
              const { name, value } = e?.target ?? {}
              onChangeArray(value, name, index)
            }}
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
                type={ButtonType.text}
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
