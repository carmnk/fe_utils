import { Skeleton, Box } from '@mui/material'
import { Checkbox, BoxProps } from '@mui/material'
import { RowComponent } from './subComponents/TableRow'
import { NoResults } from './subComponents/NoResults'
import { TableHeader } from './subComponents/TableHeader'
import { TableProps } from './types'
import { useDraggableRows } from './useDraggableRows'
import { TableComponent } from './subComponents/TableComponent'
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Fragment,
  ReactNode,
  CSSProperties,
} from 'react'
import { Flex } from '../_wrapper'

const Tfoot = (props: BoxProps) => <Box component="tfoot" {...props} />
const Tr = (props: BoxProps) => <Box component="tr" {...props} />

/**
 * React table composite component
 * @prop {Record<string, unknown>[]} data - table data
 * @prop {Record<string, unknown>} footerData - table footer data
 * @prop {TableColumnType[]} columns - table columns
 * @prop {string[]} selectedRows - selected rows
 * @prop {FilterType[]} filters - table filters
 * @prop {boolean} loading - loading state
 * @prop {number} loadingRows - number of rows to show skeleton loading
 */
export const Table = (props: TableProps) => {
  const {
    loading,
    loadingRows,

    data,
    footerData,
    columns,
    selectedRows,
    filters,

    headerBackground,
    footerBackground,
    disableClearFiltersOnNoResults,
    disableSelection,
    disableNoResults,
    disableTableHeader,

    noResultsLabel,
    clearFilersOnNoResultLabel,

    // dynamic setting
    getSelectedRow,
    getTrLeftBorderColor,
    getTrProps,

    reorderRowId,
    onReorder,
    onSelectRow,
    // filter Actions
    onSelectAllFilters,
    onUnselectAllFilters,
    onSetFilters,
    sx,
    rootInjection,
    disableSelectAll,
  } = props

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { draggedRows, bind, draggedItemId, hoverItemId } = useDraggableRows({
    rows: data,
    onReorder,
    reorderRowId,
  })

  const [openFilters, setOpenFilters] = useState(
    () => columns?.map?.(() => false) || []
  )
  useEffect(() => {
    if (columns?.length === openFilters?.length) return
    setOpenFilters(columns?.map?.(() => false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  const sortings = useMemo(
    () => filters?.filter((filter) => filter?.filterKey?.includes('sorting')),
    [filters]
  )

  const handleChangeNewSorting = useCallback(
    (sortValue: string) => {
      const sortKey = 'sorting'
      const curSortFilter = filters?.find(
        (filter) =>
          filter?.filterKey === sortKey && filter.value.includes(sortValue)
      )
      const allFiltersExSortings = filters?.filter(
        (filter) => filter?.filterKey !== sortKey
      )
      if (curSortFilter) {
        if (curSortFilter?.value.slice(-3) === 'asc') {
          onSetFilters?.([
            ...(allFiltersExSortings ?? []),
            { filterKey: sortKey, value: `${sortValue},desc` },
          ])
        } else {
          onSetFilters?.(allFiltersExSortings ?? [])
        }
      } else {
        onSetFilters?.([
          ...(allFiltersExSortings ?? []),
          { filterKey: sortKey, value: `${sortValue},asc` },
        ])
      }
    },
    [filters, onSetFilters]
  )

  const handleOpenFilters = useMemo(() => {
    return (
      columns?.map?.((_col, cIdx) => () => {
        setOpenFilters((current) => [
          ...current.slice(0, cIdx),
          true,
          ...current.slice(cIdx + 1),
        ])
      }) ?? []
    )
  }, [columns])
  const handleCloseFilters = useMemo(
    () =>
      columns?.map?.((_col, cIdx) => () => {
        setOpenFilters((current) => [
          ...current.slice(0, cIdx),
          false,
          ...current.slice(cIdx + 1),
        ])
      }) ?? [],
    [columns]
  )

  const handleClickSelectAll = useCallback(() => {
    if (!selectedRows?.length) {
      onSelectAllFilters?.()
    } else {
      //Clean it
      onUnselectAllFilters?.()
    }
  }, [selectedRows, onSelectAllFilters, onUnselectAllFilters])

  return (
    <TableComponent disableTableHeader={disableTableHeader} sx={sx}>
      <TableHeader
        columns={columns}
        sortings={sortings}
        openFilters={openFilters}
        handleOpenFilters={handleOpenFilters}
        handleCloseFilters={handleCloseFilters}
        filters={filters}
        handleChangeSorting={handleChangeNewSorting}
        disableTableHeader={disableTableHeader}
        headerBackground={headerBackground}
        selectedRows={selectedRows}
        onUnselectAll={onUnselectAllFilters}
        onSelectAll={onSelectAllFilters}
        handleClickSelectAll={handleClickSelectAll}
        onSetFilters={onSetFilters}
        disableSelectAll={disableSelectAll}
      />

      <tbody>
        {loading ? (
          new Array(loadingRows ?? 10).fill(0).map((_x, xIdx) => (
            <Tr key={xIdx}>
              {(columns?.length ? columns : new Array(5).fill(0))?.map(
                (_y, yIdx) => (
                  <td key={`${xIdx}-${yIdx}`} style={{ height: '48px' }}>
                    <Skeleton variant="text" height="36px" />
                  </td>
                )
              )}
            </Tr>
          ))
        ) : (
          <>
            {draggedRows?.length ? (
              draggedRows?.map?.((row, rIdx) => {
                const selectedItemId =
                  typeof getSelectedRow === 'function'
                    ? getSelectedRow(row, rIdx)
                    : typeof getSelectedRow === 'string' &&
                        row &&
                        typeof row === 'object' &&
                        getSelectedRow in row
                      ? row[getSelectedRow]
                      : ''
                return (
                  <Fragment key={rIdx}>
                    <RowComponent
                      key={rIdx}
                      enableDrag={!!reorderRowId}
                      isDragged={
                        row?.[(reorderRowId as keyof typeof row) ?? ''] ===
                          draggedItemId && !!draggedItemId
                      }
                      bind={bind}
                      getTrProps={getTrProps}
                      getTrLeftBorderColor={getTrLeftBorderColor}
                      // onClick={() => {
                      //   const id = getSelectedRow?.(row, rIdx)
                      //   if (!renderExpandedRows || !id) return
                      //   setExpandedRowIds?.(((current: number[]) =>
                      //     // current?.includes(id) ? current?.filter((rowId) => rowId !== id) : [...current, id]
                      //     current?.includes(id) ? [] : [id]) as any) // only 1 expandable item allowed
                      //   onExpandedRow?.(row)
                      // }}
                      row={row}
                      rowIdx={rIdx}
                    >
                      {columns.map((col, cIdx) => {
                        const renderCell =
                          typeof col?.renderCell === 'function' ? (
                            col?.renderCell(row, cIdx, rIdx)
                          ) : typeof col?.renderCell === 'string' ? (
                            <Box
                              component="td"
                              key={cIdx}
                              style={col?.style as CSSProperties}
                            >
                              {(row[col?.renderCell] ||
                                row[col?.renderCell] === false) &&
                              ['object', 'boolean'].includes(
                                typeof row[col?.renderCell]
                              )
                                ? row[col?.renderCell]?.toString()
                                : (row[col?.renderCell] as ReactNode)}
                            </Box>
                          ) : null

                        return col?.isRowSelect ? (
                          <td key={cIdx}>
                            <Flex alignItems="center" justifyContent="center">
                              <Checkbox
                                disabled={disableSelection}
                                tabIndex={-1}
                                checked={
                                  !!selectedRows?.includes?.(
                                    selectedItemId as string
                                  )
                                }
                                size="small"
                                onClick={() => {
                                  !disableSelection && onSelectRow?.(row, rIdx)
                                }}
                              />
                            </Flex>
                          </td>
                        ) : (
                          renderCell || <td key={cIdx} />
                        )
                      })}
                    </RowComponent>
                    {/* {expandedRowIds?.includes(
                    getSelectedRow?.(row, rIdx) ?? ''
                  ) ? (
                    <>
                      {renderExpandedRows?.(row, rIdx)}
                      <tr style={{ height: 2 }} key={`filler-00-${rIdx}`} />
                    </>
                  ) : expandedRowIds ? (
                    <>
                      //{/* empty row + gap placeholder to maintain sequence - even/odd
                      <tr style={{ height: 0 }} key={`filler-01-${rIdx}`} />
                      <tr style={{ height: 2 }} key={`filler-02-${rIdx}`} />
                    </>
                  ) : null} */}
                  </Fragment>
                )
              })
            ) : !disableNoResults ? (
              <tr key={'no-result'} data-testid="row_no_result">
                <td colSpan={columns?.length}>
                  <NoResults
                    clearFilters={onUnselectAllFilters}
                    label={noResultsLabel}
                    disableClearFilters={
                      !!disableClearFiltersOnNoResults ||
                      !!(filters && !filters?.length)
                    }
                    clearFilersLabel={clearFilersOnNoResultLabel}
                  />
                </td>
              </tr>
            ) : null}
          </>
        )}
      </tbody>
      {footerData && columns?.find((col) => col?.renderFooterCell) && (
        <Tfoot bgcolor={footerBackground}>
          <tr>
            {columns?.map((col, cIdx) => {
              const renderedFooterCell =
                typeof col?.renderFooterCell === 'function' ? (
                  col?.renderFooterCell?.(footerData, cIdx)
                ) : typeof col?.renderFooterCell === 'string' ? (
                  <td>{footerData[col?.renderFooterCell] as string}</td>
                ) : null
              return !renderedFooterCell && renderedFooterCell !== null ? (
                <td key={cIdx} />
              ) : (
                renderedFooterCell
              )
            })}
          </tr>
        </Tfoot>
      )}
      {rootInjection}
    </TableComponent>
  )
}
