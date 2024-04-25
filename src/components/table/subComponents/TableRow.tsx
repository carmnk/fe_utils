import { PropsWithChildren } from 'react'
import { BoxProps, Box, useTheme } from '@mui/material'

const Tr = (props: BoxProps) => <Box component="tr" {...props} />
// const Td = (props: BoxProps) => <Box component="td" {...props} />

export const RowComponent = (
  props: PropsWithChildren<{
    bind: any
    trProps: any
    onClick?: any
    row: any
    getRowColor: any
    rIdx: number
    isDragged?: boolean
    enableDrag?: boolean
  }>
) => {
  const {
    trProps,
    getRowColor,
    onClick,
    row,
    bind,
    rIdx,
    children,
    isDragged,
    enableDrag,
  } = props
  const theme = useTheme()

  return (
    <Tr
      {...trProps?.(row)}
      onClick={onClick}
      sx={{
        borderLeft: getRowColor
          ? `5px solid ${getRowColor?.(row)}`
          : '0px solid',
        // backgroundColor: isDragged
        //   ? theme.palette.primary.light + ' !important'
        //   : undefined,
        ...(trProps?.(row)?.sx ?? {}),
        userSelect: enableDrag ? 'none' : undefined,
        ...(isDragged
          ? {
              '& td': {
                backgroundColor: theme.palette.primary.light,
              },
              '& td:first-of-type': {
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              },
              '& td:last-of-type': {
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              },
            }
          : {}),
      }}
      {...bind({ ...row, _idx: rIdx }, rIdx)}
      // key={rIdx}
    >
      {children}
    </Tr>
  )
}
