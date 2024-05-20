import { useCallback, useMemo, useState } from 'react'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
} from '@mui/x-date-pickers/DesktopDatePicker'
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
  const [validDate, setValidDate] = useState(
    (value && moment(value)?.isValid?.()) || false
  )
  console.log('VALID DATE', validDate, value)

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

  const slots: DesktopDatePickerProps<Moment>['slots'] = useMemo(
    () => ({
      openPickerButton: (props) => (
        <Button
          iconButton
          icon={mdiCalendar}
          variant="text"
          {...(props as any)}
        />
      ),
      textField: (propsFromDateField: any) => {
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
            // value={
            //   !moment(propsFromDateField?.value).isValid()
            //     ? propsFromDateField?.value
            //     : moment(value)
            // }
            slotProps={{
              inputContainer: {
                ...(propsFromDateField?.InputProps ?? {}),
                ...(restIn?.slotProps?.inputContainer ?? {}),
              },
              input: {
                ...propsFromDateField?.inputProps,
                ...(restIn?.slotProps?.input ?? {}),
              },
              // formHelperText: {
              //   content: 'the date is invalid',
              //   // ...(restIn?.slotProps?.input ?? {}),
              // },
            }}
            label={label}
            helperText={
              helperText // ?? (!value && !error ? '' : 'the date is invalid')
            }
            error={error}
            name={name}
            onChange={onChangeTextField}
          />
        )
      },
    }),
    [error, helperText, label, name, restIn]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
        format="DD/MM/YYYY"
        {...restIn}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        slots={slots}
      />
    </LocalizationProvider>
  )
}
