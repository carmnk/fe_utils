import { BoxProps } from '@mui/material'
import { ReactNode } from 'react'
export type FilterType = {
  value: string
  filterKey: string
}
export interface SelectHeaderCellProps {
  isRowSelect?: boolean
}
export interface UnfilteredHeaderCellProps<
  TableDataType = Record<string, unknown>,
  FooterDataType = Record<string, unknown>,
> {
  isRowSelect?: boolean
  header: ReactNode
  headerToolTip?: string
  sortKey?: string
  renderCell:
    | string
    | ((item: TableDataType, cIdx: number, rIdx: number) => React.ReactNode)
  renderFooterCell?:
    | string
    | ((footerData: FooterDataType, idx: number) => React.ReactNode)
}

export interface FilteredTableHeaderCellProps<
  TableDataType = Record<string, unknown>,
  FooterDataType = Record<string, unknown>,
  OptionType = {
    [key: string]: any
  },
> extends UnfilteredHeaderCellProps<TableDataType, FooterDataType> {
  additionalFilterKeys?: string[]
  filterKey?: string
  filterOptions?: OptionType[]
  getFilterValue?: (item: OptionType) => string
  getIcon?: (item: TableDataType) => ReactNode
  getItemLabel?: (item: OptionType) => string
  isFilterLocked?: boolean
  renderFilterKey?: (key: any, value: any) => any
  selectedFilters?: string[]
}
export type TableColumnType<
  TableDataType = Record<string, unknown>,
  OptionType = {
    [key: string]: any
  },
  FooterDataType = Record<string, unknown>,
> = FilteredTableHeaderCellProps<TableDataType, FooterDataType, OptionType>

export type TableProps<
  TableDataType = Record<string, unknown>,
  OptionType = {
    [key: string]: any
  },
  FooterDataType = Record<string, unknown>,
> = {
  loading?: boolean
  data: TableDataType[]
  columns: TableColumnType<TableDataType, OptionType, FooterDataType>[]
  selectedRows?: any[]

  loadingRows?: number
  headerBackground?: string
  footerBackground?: BoxProps['bgcolor']
  noResultsLabel?: string
  clearFilersOnNoResultLabel?: string

  disableSelection?: boolean
  disableNoResults?: boolean
  disableTableHeader?: boolean
  disableClearFiltersOnNoResults?: boolean
  filters: {
    value: any
    filterKey: string
  }[]

  footerData?: any
  getTrLeftBorderColor?: string | ((item: TableDataType, idx: number) => string)
  getTrProps?: (
    item: any,
    idx: number
  ) => {
    [key: string]: any
  }
  getSelectedRow?: string | ((item: TableDataType, idx: number) => any)
  onUnselectAllFilters?: () => void
  onReorder?: (itemFrom: any, itemTo: any) => void
  onSelectRow?: (item: TableDataType, idx: number) => void
  onSelectAllFilters?: () => void
  onSetFilters?: (
    allValues: {
      value: string
      filterKey: string
    }[]
  ) => void

  reorderRowId?: string
  sx?: BoxProps['sx']
  rootInjection?: ReactNode
}
