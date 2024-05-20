import { useCallback, useMemo, useState } from 'react'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePickerProps as MDatePickerProps } from '@mui/x-date-pickers'
import {  BoxProps, TypographyProps } from '@mui/material'
import { useTheme } from '@mui/material'
import { GenericInputFieldProps } from './types'
import { Button } from '../buttons'
import { mdiCalendar } from '@mdi/js'
import CTextField from './TextField'

export type DatePickerProps = GenericInputFieldProps<'date'> &
  MDatePickerProps<Moment> & {
    ContainerProps?: BoxProps
    labelSx?: TypographyProps
    IconComponent?: React.ReactNode
    onChange?: (newValue: Moment | null, name?: string) => void
    value?: string | null
  }

export const DatePicker = (props: DatePickerProps) => {
  const {
    label,
    error,
    value,
    onChange,
    disabled,
    IconComponent,
    helperText,
    color,
    name,
  } = props
  const [validDate, setValidDate] = useState(true)
  const theme = useTheme()


  const handleChange = useCallback(
    (newValue: Moment | null) => {
      if (moment(newValue).isValid()) {
        setValidDate(true)
        onChange?.(newValue, name)
      } else {
        setValidDate(false)
        onChange?.(newValue, name)
      }
    },
    [name, onChange]
  )

  

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
      
        format="DD/MM/YYYY"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        slots={{
          openPickerButton: (props) => (
            <Button
              iconButton
              icon={mdiCalendar}
              variant="text"
              {...(props as any)}
            />
          ),
          textField: (props) => {
            console.warn('PROPS TEXTFIELD', props)
            return (
              <CTextField
                {...props}
                slotProps={{
                  inputContainer: { ...props?.InputProps },
                  input: { ...props?.inputProps },
                }}
                label={label}
                helperText={helperText}
              />
            )
          },
        }}
        slotProps={{
          textField: {
            name,
            error: error == !validDate,
            color: color,
          } as any,
        }}

      />
    </LocalizationProvider>
  )
}
