import { MouseEvent, PropsWithChildren, useMemo } from 'react'
import { BoxProps, Box } from '@mui/material'
import { TableProps } from '../types'

const Tr = (props: BoxProps) => <Box component="tr" {...props} />

export const RowComponent = (
  props: PropsWithChildren<{
    bind: any
    getTrProps: TableProps['getTrProps']
    onClick?: (e?: MouseEvent<HTMLDivElement>) => void
    row: TableProps['data'][0]
    getTrLeftBorderColor: TableProps['getTrLeftBorderColor']
    rowIdx: number
    isDragged?: boolean
    enableDrag?: boolean
  }>
) => {
  const {
    getTrProps,
    getTrLeftBorderColor,
    onClick,
    row,
    bind,
    rowIdx,
    children,
    isDragged,
    enableDrag,
  } = props

  const internalTrProps = useMemo(() => {
    const trBorderColor =
      typeof getTrLeftBorderColor === 'function'
        ? getTrLeftBorderColor(row, rowIdx)
        : typeof getTrLeftBorderColor === 'string'
          ? row[getTrLeftBorderColor]
          : undefined

    return {
      ...(getTrProps?.(row, rowIdx) ?? {}),
      sx: {
        borderLeft: trBorderColor ? `5px solid ${trBorderColor}` : '0px solid',
        // backgroundColor: isDragged
        //   ? theme.palette.primary.light + ' !important'
        //   : undefined,
        ...(getTrProps?.(row, rowIdx)?.sx ?? {}),
        userSelect: enableDrag ? 'none' : undefined,
        ...(isDragged
          ? {
              '& td': {
                backgroundColor: 'primary.light',
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
        ...bind({ ...row, _idx: rowIdx }, rowIdx),
      },
    }
  }, [
    getTrProps,
    row,
    getTrLeftBorderColor,
    isDragged,
    enableDrag,
    bind,
    rowIdx,
  ])

  return (
    <Tr {...internalTrProps} onClick={onClick}>
      {children}
    </Tr>
  )
}
