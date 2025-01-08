import { useCallback, useMemo } from 'react'
import { Table, TableProps } from '../../../../components'
import { CommonComponentPropertys } from '../../componentProperty'

export const TableWrapper = (props: TableProps & CommonComponentPropertys) => {
  const { appController, id, data, ...rest } = props

  const tableUis = appController?.state?.tableUis
  const updateTableUi = appController?.actions?.updateTableUi

  const clientFilters = useMemo(
    () => tableUis?.[id]?.filters ?? [],
    [tableUis, id]
  )
  const clientFiltersExSorting = useMemo(
    () => clientFilters?.filter((f) => f.filterKey !== 'sorting'),
    [clientFilters]
  )
  const clientFilterSorting = clientFilters?.filter(
    (f) => f.filterKey === 'sorting'
  )?.[0]?.value
  const [clientFilterKey, clientFilterDirection] =
    clientFilterSorting?.split?.(',') ?? []

  const dataProp = data
  const isPlaceholderProp = typeof dataProp === 'string'
  const tableData = useMemo(
    () =>
      ((isPlaceholderProp ? data : dataProp) as Record<string, string>[]) || [],
    [data, dataProp, isPlaceholderProp]
  )

  const clientFilteredTableData = useMemo(
    () =>
      tableData?.filter?.((d) =>
        clientFiltersExSorting?.length
          ? clientFilters.some((f) => f.value === d[f.filterKey])
          : true
      ) ?? [],
    [tableData, clientFiltersExSorting, clientFilters]
  )

  const clientSortedFilteredTableData = useMemo(
    () =>
      clientFilterKey
        ? clientFilteredTableData?.sort?.((a, b) => {
            const sortKey = clientFilterKey
            return a?.[sortKey] > b?.[sortKey]
              ? clientFilterDirection === 'asc'
                ? 1
                : -1
              : b?.[sortKey] > a?.[sortKey]
                ? clientFilterDirection === 'asc'
                  ? -1
                  : 1
                : 0
          })
        : clientFilteredTableData,
    [clientFilteredTableData, clientFilterKey, clientFilterDirection]
  )

  const handleSetFilters = useCallback(
    (newFilters: { filterKey: string; value: string }[]) => {
      if (updateTableUi) {
        const tableUi = {
          [id]: { filters: newFilters, onSetFilters: () => {} },
        }
        updateTableUi?.(tableUi)
      }
    },
    [updateTableUi, id]
  )

  return (
    <Table
      {...rest}
      data={clientSortedFilteredTableData || []}
      onSetFilters={handleSetFilters}
      filters={clientFilters}
    />
  )
}
