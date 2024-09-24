import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
} from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import { GenericInputFieldProps } from './types'
import { Button } from '../buttons'
import { mdiCalendar } from '@mdi/js'
import { CTextField, CTextFieldProps } from './TextField'
import { isEqual } from 'lodash'

type MDatePickerExTextfieldProps = Omit<
  DesktopDatePickerProps<Moment>,
  keyof CTextFieldProps
> & { slots: DesktopDatePickerProps<Moment>['slots'] }

export type DatePickerProps = GenericInputFieldProps<'date'> & {
  datePickerProps?: MDatePickerExTextfieldProps
} & CTextFieldProps & {
    // onChange?: (newValue: Moment | null, name?: string) => void
    value?: string | null
    slotProps?: DesktopDatePickerProps<Moment>['slotProps'] &
      CTextFieldProps['slotProps']
    outputFormat?: 'ISO_UTC'
  }

// const datePickerProps = []

export const DatePicker = (props: DatePickerProps) => {
  const {
    // datePickerProps,
    onChange, // not for TextField
    datePickerProps,

    // end of datePickerProps
    // textfieldProps
    borderRadius,
    disabled,
    error,
    helperText,
    name,
    label,
    required,
    sx,
    disableHelperText,
    disableLabel,
    color,
    tooltip,
    placeholder,
    maxLength,
    rows,
    onChangeCompleted,
    injectLabelComponent,
    labelSubtext,
    useNotchedLabel,
    notchedLabelBgColor,
    notchedLabelMarginLeft,
    autoFocus,
    className,
    defaultValue,
    onError,
    inputRef,
    // custom
    value,
    outputFormat = 'ISO_UTC',
    slotProps,
    ...restIn
  } = props

  if (Object.keys(restIn).length > 0) console.warn('Unhandled Props', restIn)

  const [validDate, setValidDate] = useState(
    (value && moment(value)?.isValid?.()) || false
  )

  const valueMoment = useMemo(() => moment(value), [value])

  console.debug('VALID DATE', validDate, value)

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

  const datePickerSlots: DesktopDatePickerProps<Moment>['slots'] = useMemo(
    () => ({
      ...datePickerProps?.slots,
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
            required={required}
            sx={sx}
            disableHelperText={disableHelperText}
            disableLabel={disableLabel}
            color={color}
            tooltip={tooltip}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            onChangeCompleted={onChangeCompleted}
            injectLabelComponent={injectLabelComponent}
            labelSubtext={labelSubtext}
            useNotchedLabel={useNotchedLabel}
            notchedLabelBgColor={notchedLabelBgColor}
            notchedLabelMarginLeft={notchedLabelMarginLeft}
            autoFocus={autoFocus}
            className={className}
            defaultValue={defaultValue}
            onError={onError}
            inputRef={inputRef}
            borderRadius={borderRadius}
            // value={
            //   !moment(propsFromDateField?.value).isValid()
            //     ? propsFromDateField?.value
            //     : moment(value)
            // }
            slotProps={{
              inputContainer: {
                ...(inputContainerPropsFromDatefield ?? {}),
                ...(slotProps?.inputContainer ?? {}),
              },
              input: {
                ...propsFromDateField?.inputProps,
                ...(slotProps?.input ?? {}),
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
    [
      error,
      helperText,
      label,
      name,
      datePickerProps?.slots,
      slotProps,
      required,
      sx,
      disableHelperText,
      disableLabel,
      color,
      tooltip,
      placeholder,
      maxLength,
      rows,
      onChangeCompleted,
      injectLabelComponent,
      labelSubtext,
      useNotchedLabel,
      notchedLabelBgColor,
      notchedLabelMarginLeft,
      autoFocus,
      className,
      defaultValue,
      onError,
      inputRef,
      borderRadius,
    ]
  )

  const restInRef = useRef(restIn)

  useEffect(() => {
    if (restInRef.current === restIn) {
      console.debug("restIn didn't change (shallow)")
    }
    if (isEqual(restInRef.current, restIn)) {
      console.debug('restIn is deep-equal')
    }
    restInRef.current = restIn
  }, [restIn])

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DesktopDatePicker<Moment>
        value={valueMoment}
        onChange={handleChange}
        disabled={disabled}
        slots={datePickerSlots}
        //
        {...datePickerProps}
      />
    </LocalizationProvider>
  )
}
