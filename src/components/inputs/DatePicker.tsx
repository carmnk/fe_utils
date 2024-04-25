import { useCallback, useMemo, useState } from 'react'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePickerProps as MDatePickerProps } from '@mui/x-date-pickers'
import { Box, BoxProps, Typography, TypographyProps } from '@mui/material'
import { useTheme, TextField } from '@mui/material'
import Icon from '@mdi/react'
import { mdiCalendar } from '@mdi/js'
import { Stack } from '../_wrapper/Stack'
import { CommonInputFieldProps } from './_types'

export type DatePickerProps = CommonInputFieldProps &
  Omit<
    MDatePickerProps<string, Date>,
    'renderInput' | 'name' | 'onChange' | 'value'
  > & {
    ContainerProps?: BoxProps
    labelSx?: TypographyProps
    IconComponent?: React.ReactNode
    onChange?: MDatePickerProps<string, Date>['onChange']
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
    (newValue: Date | null) => {
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
            inputFormat="DD.MM.YYYY"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            renderInput={(params: any) => (
              <TextField
                {...params}
                name={name}
                sx={{ ...(params?.sx || {}), background: '#fff' }}
                error={error || !validDate}
                helperText={
                  (!validDate && value !== '') ||
                  ['Invalid date'].includes(value ?? '') ||
                  (value === '' && error)
                    ? 'Format nicht erkannt'
                    : ' '
                }
                FormHelperTextProps={{
                  style: {
                    color: error
                      ? theme.palette.error.main
                      : 'rgba(0, 0, 0, 0.6)',
                    marginLeft: 2,
                  },
                }}
                disabled={disabled}
              />
            )}
            className="font-base h-[45px]"
            InputProps={{
              sx: { '& > input': { p: '12px', pl: 2, pr: 2, fontSize: 14 } },
              disabled,
            }}
            // componentsProps={{ icon : { fill: 'blue' } }}
            components={{
              OpenPickerIcon: IconComponent
                ? () => null
                : () => <Icon path={mdiCalendar} size={1} />,
            }}
            InputAdornmentProps={{ sx: { pr: 1 }, onBlur: () => {} }}
            OpenPickerButtonProps={{
              name: name ? name + '_picker' : undefined,
            }}

            // shouldDisableDate={(date) => {
            //   return false
            // }}
          />
        </LocalizationProvider>
      </div>
      <Stack
        direction="row"
        alignItems="center"
        position="absolute"
        height="calc(100% - 24px)"
        top={24}
        right={16}
      >
        {IconComponent}
      </Stack>
    </Box>
  )
}