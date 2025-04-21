import {
  CheckboxProps as MCBProps,
  FormHelperText,
  TooltipProps,
  FormControlLabelProps,
  FormHelperTextProps,
  TypographyProps,
  Box,
} from '@mui/material'
import { Checkbox as MCheckbox, FormControlLabel, Tooltip } from '@mui/material'
import { GenericInputFieldProps } from './types'
import { ChangeEvent, useCallback, useMemo } from 'react'

export type CheckboxProps = GenericInputFieldProps<'bool'> &
  Omit<MCBProps, 'value' | 'onChange'> & {
    onChangeCompleted?: (
      checked: boolean,
      e: ChangeEvent<HTMLInputElement>
    ) => void
    // now common for all
    // tooltip?: string
    // color?:
    //   | 'primary'
    //   | 'secondary'
    //   | 'default'
    //   | 'error'
    //   | 'info'
    //   | 'success'
    //   | 'warning'
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

export const Checkbox = (props: CheckboxProps) => {
  const {
    value,
    onChange,
    name,
    label,
    tooltip,
    helperText,
    color,
    slotProps,
    disableHelperText,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    disableLabel,
    onChangeCompleted,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    error,
    ...restCheckBoxProps
  } = props

  const {
    tooltip: tooltipProps,
    typography,
    formControlLabel,
    formHelperText,
  } = slotProps ?? {}

  // const formControlLabelSlotProps = useMemo(() => {
  //   return typography ? { typography } : {}
  // }, [typography])

  const formControlLabelSlotProps = useMemo(
    () => ({
      typography: {
        variant: 'caption' as const,
        ...(typography ?? {}),
        ...(error ? errorSlotProps.typography : {}),
      },
    }),
    [typography, error]
  )

  const handleChangeCheckbox = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked
      onChange?.(checked, e, name)
    },
    [name, onChange]
  )

  return (
    <Tooltip
      disableFocusListener={!tooltip}
      disableHoverListener={!tooltip}
      disableTouchListener={!tooltip}
      disableInteractive={!tooltip}
      placement="top"
      arrow
      {...(tooltipProps ?? {})}
      title={tooltip}
    >
      <Box>
        <FormControlLabel
          slotProps={formControlLabelSlotProps}
          control={
            <MCheckbox
              name={name}
              value={value}
              checked={!!value}
              onChange={handleChangeCheckbox}
              color={color}
              {...restCheckBoxProps}
            />
          }
          label={label}
          {...formControlLabel}
        />
        {/* <Box height="23px" > */}
        {!disableHelperText && (
          <FormHelperText {...formHelperText}>
            {helperText ?? ''}
          </FormHelperText>
        )}
        {/* </Box> */}
      </Box>
    </Tooltip>
  )
}
