import { useCallback, useMemo, useState } from 'react'
import moment, { Moment } from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePickerProps as MDatePickerProps } from '@mui/x-date-pickers'
import { Box, BoxProps, Typography, TypographyProps } from '@mui/material'
import { useTheme } from '@mui/material'
import { CommonInputFieldProps } from './types'
import { Button } from '../buttons'
import { mdiCalendar } from '@mdi/js'

export type DatePickerProps = CommonInputFieldProps &
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
    required,
    error,
    labelSx,
    value,
    onChange,
    disabled,
    IconComponent,
    color,
    name,
  } = props
  const [validDate, setValidDate] = useState(true)
  const theme = useTheme()

  const themeErrorText = useMemo(
    () => ({
      color: theme.palette.error.main,
      fontWeight: 700,
    }),
    [theme]
  )

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
    <Box position="relative">
      {label && (
        <Typography
          variant="caption"
          style={error ? { color: theme.palette.error.main } : {}}
          sx={{ ...labelSx, marginBottom: '8px', marginLeft: '2px' }}
          component="div"
        >
          {label} {required && <strong style={themeErrorText}>*</strong>}
        </Typography>
      )}
      <div>
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
            }}
            slotProps={{
              textField: {
                name,
                error: error == !validDate,
                color: color,
              } as any,
            }}
            // renderInput={(params: any) => (
            //   <TextField
            //     {...params}
            //     name={name}
            //     sx={{ ...(params?.sx || {}), background: '#fff' }}
            //     error={error || !validDate}
            //     helperText={
            //       (!validDate && value !== '') ||
            //       ['Invalid date'].includes(value ?? '') ||
            //       (value === '' && error)
            //         ? 'Format nicht erkannt'
            //         : ' '
            //     }
            //     FormHelperTextProps={{
            //       style: {
            //         color: error
            //           ? theme.palette.error.main
            //           : 'rgba(0, 0, 0, 0.6)',
            //         marginLeft: 2,
            //       },
            //     }}
            //     disabled={disabled}
            //   />
            // )}
            // className="font-base h-[45px]"
            // InputProps={{
            //   sx: { '& > input': { p: '12px', pl: 2, pr: 2, fontSize: 14 } },
            //   disabled,
            // }}
            // componentsProps={{ icon : { fill: 'blue' } }}
            // components={{
            //   OpenPickerIcon: () => <Icon path={mdiCalendar} size={1} />,
            // }}
            // InputAdornmentProps={{ sx: { pr: 1 }, onBlur: () => {} }}
            // OpenPickerButtonProps={{
            //   name: name ? name + '_picker' : undefined,
            // }}

            // shouldDisableDate={(date) => {
            //   return false
            // }}
          />
        </LocalizationProvider>
      </div>
    </Box>
  )
}
