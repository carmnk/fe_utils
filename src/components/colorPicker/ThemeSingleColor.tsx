import { Tooltip, Box } from '@mui/material'
import { MouseEvent, useCallback } from 'react'

export type ThemeSingleColorProps = {
  color: string
  hidden?: boolean
  onChange?: (e: MouseEvent<HTMLDivElement>, color: string) => void
}

export const ThemeSingleColor = (props: ThemeSingleColorProps) => {
  const { color, hidden, onChange } = props
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onChange?.(e, color)
    },
    [onChange, color]
  )

  return (
    <Tooltip title={hidden ? undefined : color} placement="top" arrow>
      <Box
        bgcolor={color}
        borderRadius={'3px'}
        height={16}
        width={16}
        border="1px solid #999"
        visibility={hidden ? 'hidden' : 'visible'}
        onClick={handleClick}
      />
    </Tooltip>
  )
}
