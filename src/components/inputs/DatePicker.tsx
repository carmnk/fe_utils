import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { isEqual } from 'lodash'

export type DatePickerProps = GenericInputFieldProps<'date'> &
  MDatePickerProps<Moment> & {
    // onChange?: (newValue: Moment | null, name?: string) => void
    value?: string | null
    slotProps?: MDatePickerProps<Moment>['slotProps'] &
      CTextFieldProps['slotProps']
    outputFormat?: 'ISO_UTC'
  }

// type b = Omit<MDatePickerProps<Moment>, keyof CTextFieldProps>

// const datePickerProps = []

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

    // autoCompleteOnlyProps
    closeOnSelect,
    dayOfWeekFormatter,
    desktopModeMediaQuery,
    disableFuture,
    disableHighlightToday,
    disableOpenPicker,
    disablePast,
    displayWeekNumber,
    enableAccessibleFieldDOMStructure,
    fixedWeekNumber,
    format = 'DD/MM/YYYY',
    formatDensity,
    loading,
    localeText,
    maxDate,
    minDate,
    monthsPerRow,
    onAccept,
    onClose,
    onMonthChange,
    onOpen,
    onSelectedSectionsChange,
    onViewChange,
    onYearChange,
    open,
    openTo,
    orientation,
    readOnly,
    reduceAnimations,
    referenceDate,
    renderLoading,
    selectedSections,
    shouldDisableDate,
    shouldDisableMonth,
    shouldDisableYear,
    showDaysOutsideCurrentMonth,
    slots,
    timezone,
    view,
    viewRenderers,
    views,
    yearsPerRow,
    // end of autoCompleteOnlyProps
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

  const datePickerSlots: DesktopDatePickerProps<Moment>['slots'] = useMemo(
    () => ({
      ...slots,
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
    [error, helperText, label, name, slots, value]
  )

  const restInRef = useRef(restIn)

  useEffect(() => {
    if (restInRef.current === restIn) {
      console.log("restIn didn't change (shallow)")
    }
    if (isEqual(restInRef.current, restIn)) {
      console.log('restIn is deep-equal')
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
        closeOnSelect={closeOnSelect}
        dayOfWeekFormatter={dayOfWeekFormatter}
        // desktopModeMediaQuery={desktopModeMediaQuery}
        disableFuture={disableFuture}
        disableHighlightToday={disableHighlightToday}
        disableOpenPicker={disableOpenPicker}
        disablePast={disablePast}
        displayWeekNumber={displayWeekNumber}
        enableAccessibleFieldDOMStructure={enableAccessibleFieldDOMStructure}
        fixedWeekNumber={fixedWeekNumber}
        format={format}
        formatDensity={formatDensity}
        loading={loading}
        localeText={localeText}
        maxDate={maxDate}
        minDate={minDate}
        monthsPerRow={monthsPerRow}
        onAccept={onAccept}
        onClose={onClose}
        onMonthChange={onMonthChange}
        onOpen={onOpen}
        onSelectedSectionsChange={onSelectedSectionsChange}
        onViewChange={onViewChange}
        onYearChange={onYearChange}
        open={open}
        openTo={openTo}
        orientation={orientation}
        readOnly={readOnly}
        reduceAnimations={reduceAnimations}
        referenceDate={referenceDate}
        renderLoading={renderLoading}
        selectedSections={selectedSections}
        shouldDisableDate={shouldDisableDate}
        shouldDisableMonth={shouldDisableMonth}
        shouldDisableYear={shouldDisableYear}
        showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
        timezone={timezone}
        view={view}
        viewRenderers={viewRenderers}
        views={views}
        yearsPerRow={yearsPerRow}
      />
    </LocalizationProvider>
  )
}
