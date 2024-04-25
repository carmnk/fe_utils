import { Box, CheckboxProps as MCBProps, FormHelperText } from '@mui/material'
import { Checkbox as MCheckbox, FormControlLabel, Tooltip } from '@mui/material'
import { CommonInputFieldProps } from './_types'

export type CheckboxProps = CommonInputFieldProps &
  MCBProps & {
    formControlLabelProps?: any
    labelTypographyProps?: any
    tooltip?: string
  }

export const Checkbox = (props: CheckboxProps) => {
  const {
    value,
    onChange,
    name,
    label,
    formControlLabelProps,
    labelTypographyProps,
    tooltip,
    helperText,
    ...restCheckBoxProps
  } = props

  const slotProps: any = {}
  if (labelTypographyProps) {
    slotProps.typography = labelTypographyProps
  }

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
          slotProps={slotProps}
          control={
            <MCheckbox
              name={name}
              value={value}
              checked={!!value}
              onChange={onChange}
              {...restCheckBoxProps}
            />
          }
          label={label}
          {...formControlLabelProps}
        />
        <Box height="23px">
          <FormHelperText>{helperText ?? ''}</FormHelperText>
        </Box>
      </>
    </Tooltip>
  )
}
