import { useCallback, useMemo, useState } from 'react'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePickerProps as MDatePickerProps } from '@mui/x-date-pickers'
import { useTheme } from '@mui/material'
import { GenericInputFieldProps } from './types'
import { Button } from '../buttons'
import { mdiCalendar } from '@mdi/js'
import CTextField, { CTextFieldProps } from './TextField'

export type DatePickerProps = GenericInputFieldProps<'date'> &
  MDatePickerProps<Moment> & {
    // onChange?: (newValue: Moment | null, name?: string) => void
    value?: string | null
    slotProps?: MDatePickerProps<Moment>['slotProps'] &
      CTextFieldProps['slotProps']
  }

export const DatePicker = (props: DatePickerProps) => {
  const {
    label,
    error,
    value,
    onChange,
    disabled,
    helperText,
    name,
    ...restIn
  } = props
  const [validDate, setValidDate] = useState(true)
  const theme = useTheme()

  const handleChange = useCallback(
    (newValue: Moment | null) => {
      if (moment(newValue).isValid()) {
        setValidDate(true)
        onChange?.(
          newValue as any,
          { target: { value: newValue as any, name: name as any } } as any,
          name
        )
      } else {
        setValidDate(false)
        onChange?.(
          newValue as any,
          { target: { value: newValue as any, name: name as any } } as any,
          name
        )
      }
    },
    [name, onChange]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
        format="DD/MM/YYYY"
        {...restIn}
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
          textField: (propsFromDateField) => {
            // const { ...restFromDateField } = propsFromDateField
            // console.warn('PROPS TEXTFIELD', propsFromDateField)
            const onChangeTextField = (newValue: any, e?: any, name?: any) => {
              const event = {
                ...(e ?? {}),
                target: { ...(e?.target ?? {}), value: newValue, name },
              }
              propsFromDateField?.onChange?.(event)
            }
            return (
              <CTextField
                {...propsFromDateField}
                {...restIn}
                slotProps={{
                  inputContainer: {
                    ...(propsFromDateField?.InputProps ?? {}),
                    ...(restIn?.slotProps?.inputContainer ?? {}),
                  },
                  input: {
                    ...propsFromDateField?.inputProps,
                    ...(restIn?.slotProps?.input ?? {}),
                  },
                }}
                label={label}
                helperText={helperText}
                error={error == !validDate}
                name={name}
                onChange={onChangeTextField}
              />
            )
          },
        }}
      />
    </LocalizationProvider>
  )
}
