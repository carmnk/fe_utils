import { useCallback, useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { CommonInputFieldProps } from './_types'

const requiredFieldText = 'This field is required'

export type TextAreaProps = CommonInputFieldProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
    value: string | undefined
    onChange?: any
    rows?: number
    helperTextHeight?: number
    labelSx?: { [key: string]: string }
    onChangeCompleted?: any
    injectLabelComponent?: React.ReactNode
    labelSubtext?: React.ReactNode
    disableLabel?: boolean
  }

export const TextArea = (props: TextAreaProps) => {
  const {
    name,
    error,
    label,
    required,
    helperText,
    value,
    onChange,
    rows = 3,
    className,
    helperTextHeight,
    labelSx,
    onChangeCompleted,
    injectLabelComponent,
    labelSubtext,
    disableLabel,
    sx,
    ...rest
  } = props
  const addClass = className ? className : ''
  const theme = useTheme()

  const [valueStarted, setValueStarted] = useState<string>('')

  const themeErrorText = {
    color: theme.palette.error.main,
    fontWeight: 700,
  }

  const handleChangeCompleted = useCallback(() => {
    //dont trigger if value has not changed
    if (value === valueStarted) return
    onChangeCompleted?.(value)
  }, [onChangeCompleted, value, valueStarted])

  const handleChangeStarted = useCallback(() => {
    setValueStarted?.(value ?? '')
  }, [value])

  return (
    <div className="relative flex flex-col w-full">
      {!disableLabel && (
        <div className="grid grid-cols-[max-content_auto]">
          <Typography
            variant="caption"
            component="label"
            style={error ? { color: theme.palette.error.main } : {}}
            sx={labelSx}
          >
            {label} {required && <strong style={themeErrorText}>*</strong>}
            {labelSubtext}
          </Typography>
          {injectLabelComponent}
        </div>
      )}
      <Box
        component={'textarea'}
        {...rest}
        value={value}
        name={name}
        data-testid={name}
        rows={rows}
        onChange={onChange}
        className={`block w-full px-4 py-3 leading-tight text-gray-700 bg-white border appearance-none rounded-md focus:outline-none focus:border-grey-500 ${addClass}`}
        sx={{
          background: 'transparent',
          borderColor: error ? theme.palette.error.main : '#dde2ea',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 1,
          p: 2,
          fontSize: 18,
          fontFamily: `'Quattrocento Sans',Roboto,Helvetica,Arial,sans-serif`,
          // fontSize: 14,
          // lineHeight: '16px',
          color: 'text.primary',
          height: 'auto',
          width: '100%',
          ...(sx ?? {}),
        }}
        onBlur={handleChangeCompleted}
        onFocus={handleChangeStarted}
      />
      {(error || helperText) && (
        <Typography
          variant="caption"
          component="label"
          className="absolute bottom-0 mt-20"
          style={{
            ...(error ? { color: theme.palette.error.main } : {}),
            bottom: helperTextHeight ? -helperTextHeight : '-22px',
          }}
        >
          {helperText ? helperText : requiredFieldText}
        </Typography>
      )}
    </div>
  )
}
