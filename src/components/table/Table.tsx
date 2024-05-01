import React from 'react'
import { Skeleton, Box } from '@mui/material'
import { Checkbox, BoxProps } from '@mui/material'
import { RowComponent } from './subComponents/TableRow'
import { NoResults } from './subComponents/NoResults'
import { TableHeader } from './subComponents/TableHeader'
import { TableProps } from './types'
import { useDraggableRows } from './useDraggableRows'
import { TableComponent } from './subComponents/TableComponent'

const Tfoot = (props: BoxProps) => <Box component="tfoot" {...props} />
const Tr = (props: BoxProps) => <Box component="tr" {...props} />

export const Table = (props: TableProps) => {
  const {
    loading,
    loadingRows,
    rows,
    clearFilters,
    columns,
    selectedRows,
    onClearSelected,
    onSelectAll,
    headerBackground,
    footerBackground,
    disableClearFilters,
    noResultsLabel,
    clearFilersLabel,
    allFilters,
    setPageNumber,
    setAllFilters,
    renderSelectedItem,
    onSelectRow,
    footerData,
    getRowColor,
    disableSelection,
    trProps,
    disableNoResults,
    disableTableHeader,
    onSetAllFilters,
    userSortingIdFieldKey,
    onReorder,
  } = props

  const { draggedRows, bind, draggedItemId, hoverItemId } = useDraggableRows({
    rows,
    onReorder,
    userSortingIdFieldKey,
  })

  const [openFilters, setOpenFilters] = React.useState(
    () => columns?.map?.(() => false) || []
  )
  React.useEffect(() => {
    if (columns?.length === openFilters?.length) return
    setOpenFilters(columns?.map?.(() => false))
  }, [columns])

  const sortings = React.useMemo(
    () =>
      allFilters?.filter((filter) => filter?.filterKey?.includes('sorting')),
    [allFilters]
  )

  const handleChangeNewSorting = React.useCallback(
    (sortValue: string) => {
      const sortKey = 'sorting'
      const curSortFilter = allFilters?.find(
        (filter) =>
          filter?.filterKey === sortKey && filter.value.includes(sortValue)
      )
      const allFiltersExSortings = allFilters?.filter(
        (filter) => filter?.filterKey !== sortKey
      )
      if (curSortFilter) {
        if (curSortFilter?.value.slice(-3) === 'asc') {
          setAllFilters([
            ...allFiltersExSortings,
            { filterKey: sortKey, value: `${sortValue},desc` },
          ])
          onSetAllFilters?.([
            ...allFiltersExSortings,
            { filterKey: sortKey, value: `${sortValue},desc` },
          ])
        } else {
          setAllFilters(allFiltersExSortings)
          onSetAllFilters?.(allFiltersExSortings)
        }
      } else {
        setAllFilters((current) => [
          ...allFiltersExSortings,
          { filterKey: sortKey, value: `${sortValue},asc` },
        ])
        onSetAllFilters?.([
          ...allFiltersExSortings,
          { filterKey: sortKey, value: `${sortValue},asc` },
        ])
      }
    },
    [allFilters, setAllFilters, onSetAllFilters]
  )

  const handleOpenFilters = React.useMemo(() => {
    return columns.map((col, cIdx) => () => {
      setOpenFilters((current) => [
        ...current.slice(0, cIdx),
        true,
        ...current.slice(cIdx + 1),
      ])
    })
  }, [columns])
  const handleCloseFilters = React.useMemo(
    () =>
      columns.map((col, cIdx) => () => {
        setOpenFilters((current) => [
          ...current.slice(0, cIdx),
          false,
          ...current.slice(cIdx + 1),
        ])
      }),
    [columns]
  )

  const handleClickSelectAll = React.useCallback(() => {
    console.warn('HERE TO SELECT / UNSELECT ALL', selectedRows?.length)
    if (!selectedRows?.length) {
      onSelectAll?.()
    } else {
      //Clean it
      clearFilters?.()
    }
  }, [selectedRows, onSelectAll, clearFilters])

  return (
    <TableComponent disableTableHeader={disableTableHeader}>
      <TableHeader
        columns={columns}
        sortings={sortings}
        openFilters={openFilters}
        handleOpenFilters={handleOpenFilters}
        handleCloseFilters={handleCloseFilters}
        allFilters={allFilters}
        setAllFilters={setAllFilters}
        setPageNumber={setPageNumber}
        handleChangeSorting={handleChangeNewSorting}
        disableTableHeader={disableTableHeader}
        headerBackground={headerBackground}
        selectedRows={selectedRows}
        onClearSelected={onClearSelected}
        onSelectAll={onSelectAll}
        handleClickSelectAll={handleClickSelectAll}
        onSetAllFilters={onSetAllFilters}
      />

      <tbody>
        {loading ? (
          new Array(loadingRows ?? 10).fill(0).map((x, xIdx) => (
            <Tr key={xIdx}>
              {columns?.map((y, yIdx) => (
                <td key={`${xIdx}-${yIdx}`} style={{ height: '48px' }}>
                  <Skeleton variant="text" height="36px" />
                </td>
              ))}
            </Tr>
          ))
        ) : (
          <>
            {draggedRows?.length ? (
              draggedRows.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <RowComponent
                    enableDrag={!!userSortingIdFieldKey}
                    isDragged={
                      row?.[userSortingIdFieldKey ?? ''] === draggedItemId &&
                      !!draggedItemId
                    }
                    bind={bind}
                    trProps={trProps}
                    getRowColor={getRowColor}
                    // onClick={() => {
                    //   const id = renderSelectedItem?.(row, rIdx)
                    //   if (!renderExpandedRows || !id) return
                    //   setExpandedRowIds?.(((current: number[]) =>
                    //     // current?.includes(id) ? current?.filter((rowId) => rowId !== id) : [...current, id]
                    //     current?.includes(id) ? [] : [id]) as any) // only 1 expandable item allowed
                    //   onExpandedRow?.(row)
                    // }}
                    row={row}
                    rIdx={rIdx}
                  >
                    {columns.map((col, cIdx) =>
                      col?.isRowSelect ? (
                        <td className="p-2" key={cIdx}>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              disabled={disableSelection}
                              tabIndex={-1}
                              checked={
                                !!selectedRows?.includes?.(
                                  renderSelectedItem?.(row, rIdx) ?? ''
                                )
                              }
                              size="small"
                              onClick={() => {
                                !disableSelection && onSelectRow?.(row, rIdx)
                              }}
                            />
                          </div>
                        </td>
                      ) : (
                        col?.renderRow?.(row, cIdx, rIdx) || <td key={cIdx} />
                      )
                    )}
                  </RowComponent>
                  {/* {expandedRowIds?.includes(
                    renderSelectedItem?.(row, rIdx) ?? ''
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
                </React.Fragment>
              ))
            ) : !disableNoResults ? (
              <tr key={'no-result'} data-testid="row_no_result">
                <td colSpan={columns?.length}>
                  <NoResults
                    clearFilters={clearFilters}
                    label={noResultsLabel}
                    disableClearFilters={
                      disableClearFilters || (allFilters && !allFilters?.length)
                    }
                    clearFilersLabel={clearFilersLabel}
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
              const renderedFooterCell = col?.renderFooterCell?.(
                footerData,
                cIdx
              )
              return !renderedFooterCell && renderedFooterCell !== null ? (
                <td key={cIdx} />
              ) : (
                renderedFooterCell
              )
            })}
          </tr>
        </Tfoot>
      )}
    </TableComponent>
  )
}
