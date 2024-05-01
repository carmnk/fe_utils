import { BoxProps } from '@mui/material'
import { ReactNode } from 'react'

export type FilterType = {
  value: string
  filterKey: string
}

export interface SelectHeaderCellProps {
  isRowSelect?: boolean
}

export interface UnfilteredHeaderCellProps {
  header?: ReactNode
  headerToolTip?: string
  sortKey?: string
}

export interface FilteredTableHeaderCellProps<
  TableDataType = any,
  OptionType = { [key: string]: any },
> extends UnfilteredHeaderCellProps {
  filterOptions?: OptionType[]
  isFilterLocked?: boolean
  sortKey?: string
  getFilterValue?: (item: OptionType) => string
  renderFilterKey?: (key: any, value: any) => any
  additionalFilterKeys?: string[]
  getIcon?: (item: TableDataType) => ReactNode
  getItemLabel?: (item: OptionType) => string
  filterKey?: string
}

export type TableColumnType<
  TableDataType = any,
  OptionType = { [key: string]: any },
  FooterDataType = any,
> = FilteredTableHeaderCellProps<TableDataType, OptionType> & {
  isRowSelect?: boolean
  selectedFilters?: string[]
  renderRow?: (
    item: TableDataType,
    cIdx: number,
    rIdx: number
  ) => React.ReactNode
  renderFooterCell?: (
    footerData: FooterDataType,
    idx: number
  ) => React.ReactNode
}

export type TableProps<TableDataType = any> = {
  loading?: boolean
  loadingRows?: number
  trProps?: (item: any) => { [key: string]: any } // props for TR
  disableSelection?: boolean
  rows: TableDataType[]
  columns: TableColumnType[]
  setPageNumber: React.Dispatch<React.SetStateAction<number>>
  headerBackground?: string
  footerBackground?: BoxProps['bgcolor']
  noResultsLabel?: string
  clearFilersLabel?: string
  allFilters: { value: any; filterKey: string }[]
  clearFilters: (newValue?: any) => void
  setAllFilters: React.Dispatch<
    React.SetStateAction<{ value: string; filterKey: string }[]>
  >
  onSetAllFilters?: (allValues: { value: string; filterKey: string }[]) => void
  disableClearFilters?: boolean
  // selecting rows
  selectedRows?: any[]
  onClearSelected?: () => void
  onSelectAll?: () => void
  renderSelectedItem?: (item: TableDataType, idx: number) => any
  onSelectRow?: (item: TableDataType, idx: number) => void
  footerData?: any
  getRowColor?: (item: TableDataType) => string
  disableNoResults?: boolean
  disableTableHeader?: boolean
  onReorder?: (itemFrom: any, itemTo: any) => void // row index is exposed by _idx
  userSortingIdFieldKey?: string
}
