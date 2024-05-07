import {
  CheckboxProps as MCBProps,
  FormHelperText,
  TooltipProps,
  FormControlLabelProps,
  FormHelperTextProps,
  TypographyProps,
} from '@mui/material'
import { Checkbox as MCheckbox, FormControlLabel, Tooltip } from '@mui/material'
import { InputFieldProps } from './types'
import { ChangeEvent, useCallback, useMemo } from 'react'

export type CheckboxProps = InputFieldProps<'bool'> &
  Omit<MCBProps, 'value' | 'onChange'> & {
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
    disableLabel,
    ...restCheckBoxProps
  } = props

  const {
    tooltip: tooltipProps,
    typography,
    formControlLabel,
    formHelperText,
  } = slotProps ?? {}

  const formControlLabelSlotProps = useMemo(() => {
    return typography ? { typography } : {}
  }, [typography])

  const handleChangeCheckbox = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked
      onChange(checked, e, name)
    },
    [name, onChange]
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
      </>
    </Tooltip>
  )
}
