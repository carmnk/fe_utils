import { useCallback, useMemo, useState } from 'react'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { GenericInputFieldProps } from './types'
import { Button } from '../buttons'
import { mdiCalendar } from '@mdi/js'
import CTextField, { CTextFieldProps } from './TextField'
import { TimeField, TimeFieldProps } from '@mui/x-date-pickers/TimeField'

export type CTimeFieldProps = GenericInputFieldProps<'time'> &
  TimeFieldProps<Moment> & {
    // onChange?: (newValue: Moment | null, name?: string) => void
    value?: string | null
    slotProps?: TimeFieldProps<Moment>['slotProps'] &
      CTextFieldProps['slotProps']
    outputFormat?: 'ISO_UTC'
  }

export const CTimeField = (props: CTimeFieldProps) => {
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
          ? moment(newValue)
              .startOf(restIn?.format?.includes('s') ? 'second' : 'minute')
              .toISOString()
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
    [error, helperText, label, name]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimeField
        // format="DD/MM/YYYY"
        {...restIn}
        value={valueMoment}
        onChange={handleChange}
        disabled={disabled}
        slots={slots}
      />
    </LocalizationProvider>
  )
}
