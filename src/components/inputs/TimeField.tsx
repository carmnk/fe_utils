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
  TimeFieldProps<Moment> &
  CTextFieldProps & {
    // onChange?: (newValue: Moment | null, name?: string) => void
    value?: string | null
    slotProps?: TimeFieldProps<Moment>['slotProps'] &
      CTextFieldProps['slotProps']
    outputFormat?: 'ISO_UTC'
  }

// type a = Pick<TimeFieldProps<Moment>, keyof CTextFieldProps>
// type b = a['']

export const CTimeField = (props: CTimeFieldProps) => {
  const {
    value,
    onChange,
    outputFormat = 'ISO_UTC',
    slotProps,
    // timefieldOnly props
    ampm,
    clearable,
    disableFuture,
    disableIgnoringDatePartForTimeValidation,
    disablePast,
    // enableAccessibleFieldDOMStructure,
    format,
    formatDensity,
    maxTime,
    minTime,
    minutesStep,
    onClear,
    onSelectedSectionsChange,
    readOnly,
    referenceDate,
    selectedSections,
    shouldDisableTime,
    shouldRespectLeadingZeros,
    slots,
    timezone,
    // end timefieldOnly props
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
    ...restIn1
  } = props

  //  props
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
          ? moment(newValue)
              .startOf(format?.includes('s') ? 'second' : 'minute')
              .toISOString()
          : newValue
      onChange?.(
        valueOut as any,
        { target: { value: valueOut as any, name: name as any } } as any,
        name
      )
    },
    [name, onChange, outputFormat, format]
  )

  const timeFieldSlots: DesktopDatePickerProps<Moment>['slots'] = useMemo(
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
            borderRadius={borderRadius}
            disabled={disabled}
            error={error}
            helperText={helperText}
            name={name}
            label={label}
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
            slotProps={{
              inputContainer: {
                ...(propsFromDateField?.InputProps ?? {}),
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
            onChange={onChangeTextField}
          />
        )
      },
    }),
    [
      slotProps, // textfieldProps
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
    ]
  )

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimeField
        // format="DD/MM/YYYY"

        value={valueMoment}
        onChange={handleChange}
        disabled={disabled}
        slots={timeFieldSlots}
        ampm={ampm}
        clearable={clearable}
        disableFuture={disableFuture}
        disableIgnoringDatePartForTimeValidation={
          disableIgnoringDatePartForTimeValidation
        }
        disablePast={disablePast}
        // enableAccessibleFieldDOMStructure={enableAccessibleFieldDOMStructure}
        format={format}
        formatDensity={formatDensity}
        maxTime={maxTime}
        minTime={minTime}
        minutesStep={minutesStep}
        onClear={onClear}
        onSelectedSectionsChange={onSelectedSectionsChange}
        readOnly={readOnly}
        referenceDate={referenceDate}
        selectedSections={selectedSections}
        shouldDisableTime={shouldDisableTime}
        shouldRespectLeadingZeros={shouldRespectLeadingZeros}
        timezone={timezone}
      />
    </LocalizationProvider>
  )
}
