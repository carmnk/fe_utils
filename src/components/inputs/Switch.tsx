import { useMemo } from 'react'
import {
  Box,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperTextProps,
  SwitchProps,
  Tooltip,
  TooltipProps,
  TypographyProps,
} from '@mui/material'
import { Switch as MSwitch, FormHelperText } from '@mui/material'
import { InputFieldProps } from './types'

export type CSwitchProps = InputFieldProps<'bool'> &
  Omit<SwitchProps, 'value' | 'onChange'> & {
    slotProps?: {
      tooltip?: TooltipProps
      formControlLabel?: FormControlLabelProps
      typography?: TypographyProps
      formHelperText?: FormHelperTextProps
    }
  }

// const defaultSlotProps = { typography: { sx: { fontSize: '14px' } } }
const errorSlotProps = {
  typography: {
    sx: {
      // fontSize: '14px',
      color: 'error.main',
      '& +span': {
        color: 'error.main',
      },
    },
  },
}
export const Switch = (props: CSwitchProps) => {
  const {
    value,
    onChange,
    name,
    label,
    helperText,
    disableHelperText = true,
    tooltip,
    error,
    labelPlacement,
    color,
    slotProps,
    ...restCheckBoxProps
  } = props

  const {
    tooltip: tooltipProps,
    formControlLabel,
    formHelperText,
    typography,
  } = slotProps ?? {}

  const formControlLabelSlotProps = useMemo(
    () => ({
      typography: {
        ...(typography ?? {}),
        ...(error ? errorSlotProps.typography : {}),
      },
    }),
    [typography, error]
  )

  return (
    <Tooltip
      disableFocusListener={!tooltip}
      disableHoverListener={!tooltip}
      disableTouchListener={!tooltip}
      disableInteractive={!tooltip}
      title={tooltip}
      placement="top"
      arrow
      {...tooltipProps}
    >
      <>
        <FormControlLabel
          color={color}
          slotProps={formControlLabelSlotProps}
          control={
            <MSwitch
              color={color}
              name={name}
              value={value}
              checked={!!value}
              onChange={onChange}
              sx={{
                ...(restCheckBoxProps?.sx as any),
              }}
              {...(restCheckBoxProps as any)}
            />
          }
          labelPlacement={labelPlacement ?? undefined}
          label={label}
          {...formControlLabel}
        />
        {!disableHelperText && (
          // <Box height="23px">
          <FormHelperText {...formHelperText}>
            {helperText ?? ''}
          </FormHelperText>
          // </Box>
        )}
      </>
    </Tooltip>
  )
}
