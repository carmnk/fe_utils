import { Box, lighten, useMediaQuery, useTheme } from '@mui/material'
import { PropsWithChildren, useMemo } from 'react'

export type TableComponentProps = {
  disableTableHeader?: boolean
}

const disableheaderStyles = {
  opacity: 0,
  border: '0 none',
  height: 0,
}
const emptyObject = {}
const defaultTrStyles = { height: 53 }

export const TableComponent = (
  props: PropsWithChildren<TableComponentProps>
) => {
  const { disableTableHeader } = props
  const theme = useTheme()
  const hasFinePointer = useMediaQuery('(pointer: fine)')

  const theadStyles = disableTableHeader ? disableheaderStyles : emptyObject
  const trStyles = disableTableHeader ? disableheaderStyles : defaultTrStyles
  const thStyles = disableTableHeader ? disableheaderStyles : emptyObject

  const hoverBgColor =
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.66)
      : theme.palette.primary.dark
  const unevenBgColor = theme.palette.mode === 'light' ? '#fff' : '#666'
  const evenBgColor = theme.palette.mode === 'light' ? '#f7f7f8' : '#333'

  const tableStyles = useMemo(() => {
    return {
      color: theme.palette.text.primary,
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      textIndent: 0,
      borderColor: 'inherit',
      borderSpacing: '0px 2px',
      '& thead': {
        ...theadStyles,
        '& tr': {
          ...trStyles,
        },
        '& td': {
          fontSize: '14px',
          color: '#383838',
          fontWeight: 400,
          ...thStyles,
        },
      },
      '& tbody': {
        '& tr': {
          height: '53px',
          background: unevenBgColor,
        },
        ...(hasFinePointer
          ? {
              '& tr:not(.expandable):hover': {
                backgroundColor: hoverBgColor,
                '& +tr.expandable': {
                  backgroundColor: hoverBgColor + ' !important',
                },
              },
              '& tr:not(.expandable):hover+tr.expandable': {
                backgroundColor: hoverBgColor + ' !important',
              },
            }
          : {}),
        '& tr:nth-of-type(even):not(.expandable)': {
          backgroundColor: evenBgColor,
          '&:hover': {
            backgroundColor: hoverBgColor,
          },
        },
        '& tr:nth-of-type(even):not(.expandable)+tr.expandable': {
          backgroundColor: evenBgColor,
          '&:hover': {
            backgroundColor: hoverBgColor,
          },
        },
      },
    }
  }, [
    evenBgColor,
    hasFinePointer,
    hoverBgColor,
    theme,
    theadStyles,
    trStyles,
    unevenBgColor,
    thStyles,
  ])

  return (
    <Box component="table" width="100%" sx={tableStyles}>
      {props.children}
    </Box>
  )
}
