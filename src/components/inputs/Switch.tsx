import { ReactNode } from 'react'
import { Box, CheckboxProps, FormControlLabel, Tooltip } from '@mui/material'
import { Switch as MSwitch, FormHelperText } from '@mui/material'
import { CommonInputFieldProps } from './_types'

export type CCheckboxProps = CommonInputFieldProps &
  CheckboxProps & {
    formControlLabelProps?: any
    disableHelperText?: boolean
    tooltip?: ReactNode
  }

export const Switch = (props: CCheckboxProps) => {
  const {
    value,
    onChange,
    name,
    label,
    formControlLabelProps,
    helperText,
    disableHelperText = true,
    tooltip,
    ...restCheckBoxProps
  } = props

  return (
    <Tooltip
      disableFocusListener={!tooltip}
      disableHoverListener={!tooltip}
      disableTouchListener={!tooltip}
      disableInteractive={!tooltip}
      title={tooltip}
      placement="top"
      arrow
    >
      <>
        <FormControlLabel
          slotProps={{ typography: { sx: { fontSize: '14px' } } }}
          control={
            <MSwitch
              name={name}
              value={value}
              checked={!!value}
              onChange={onChange}
              {...(restCheckBoxProps as any)}
            />
          }
          label={label}
          {...formControlLabelProps}
        />
        {!disableHelperText && (
          <Box height="23px">
            <FormHelperText>{helperText ?? ''}</FormHelperText>
          </Box>
        )}
      </>
    </Tooltip>
  )
}
