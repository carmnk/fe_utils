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
    outputFormat?: 'ISO_UTC'
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
    outputFormat = 'ISO_UTC',
    ...restIn
  } = props
  const [validDate, setValidDate] = useState(
    (value && moment(value)?.isValid?.()) || false
  )

  const valueMoment = useMemo(() => moment(value), [value])

  console.log('VALID DATE', validDate, value)

  const handleChange = useCallback(
    (newValue: Moment | null) => {
      setValidDate(moment(newValue).isValid())
      const valueOut =
        outputFormat === 'ISO_UTC'
          ? moment(newValue).startOf('day').toISOString()
          : newValue
      onChange?.(
        valueOut as any,
        { target: { value: valueOut as any, name: name as any } } as any,
        name
      )
    },
    [name, onChange, outputFormat]
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
        const onChangeTextField = (newValue: Moment, e?: any, name?: any) => {
          const event = {
            ...(e ?? {}),
            target: { ...(e?.target ?? {}), value: newValue, name },
          }
          propsFromDateField?.onChange?.(event)
        }
        const { startAdornment: _s, ...inputContainerPropsFromDatefield } =
          propsFromDateField?.InputProps ?? {}
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
                ...(inputContainerPropsFromDatefield ?? {}),
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
    [error, helperText, label, name]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker
        format="DD/MM/YYYY"
        {...restIn}
        value={valueMoment}
        onChange={handleChange}
        disabled={disabled}
        slots={slots}
      />
    </LocalizationProvider>
  )
}
