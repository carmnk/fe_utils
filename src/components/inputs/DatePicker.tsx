import { ChangeEvent, RefObject, useCallback } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { GenericInputFieldProps } from './types'
import { Button } from '../buttons'
import { mdiCalendar } from '@mdi/js'
import { CTextField, CTextFieldProps } from './TextField'
import { isEqual } from 'lodash'
import { ButtonProps, TextFieldProps } from '@mui/material'

type MDatePickerExTextfieldProps = Omit<
  DesktopDatePickerProps<Moment>,
  keyof CTextFieldProps
>

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
        valueOut as string,
        {
          target: { value: valueOut as string, name: name as string },
        } as ChangeEvent<HTMLInputElement>,
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
          {...(props as ButtonProps)}
        />
      ),
      textField: (propsFromDateField: TextFieldProps) => {
        const onChangeTextField = (
          newValue: Moment,
          e?: ChangeEvent<HTMLInputElement>,
          name?: string
        ) => {
          const event = {
            ...(e ?? {}),
            target: { ...(e?.target ?? {}), value: newValue, name },
          }
          propsFromDateField?.onChange?.(
            event as unknown as ChangeEvent<HTMLInputElement>
          )
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { startAdornment: _s, ...inputContainerPropsFromDatefield } =
          propsFromDateField?.InputProps ?? {}
        return (
          <CTextField
            {...propsFromDateField}
            ref={propsFromDateField?.ref as RefObject<HTMLInputElement>}
            value={propsFromDateField?.value as string}
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
            // TODO: check if this is correct
            onChange={
              onChangeTextField as unknown as CTextFieldProps['onChange']
            }
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
