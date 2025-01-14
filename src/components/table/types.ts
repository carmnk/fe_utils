import { BoxProps } from '@mui/material'
import { ReactNode } from 'react'

export type GenericFilterValueType = string | number | boolean | null
export type GenericFilterType = {
  filterKey: string
  value: GenericFilterValueType
}

export type FilterType = {
  value: string
  filterKey: string
}

export type GenericOptionsType =
  | {
      value: string | number | boolean
      label: string
    }
  | string[]

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
    | ((item: TableDataType, cIdx: number, rIdx: number) => ReactNode)
  renderFooterCell?:
    | string
    | ((footerData: FooterDataType, idx: number) => ReactNode)
}

export interface FilteredTableHeaderCellProps<
  TableDataType = Record<string, unknown>,
  FooterDataType = Record<string, unknown>,
  OptType extends GenericOptionsType = GenericOptionsType,
> extends UnfilteredHeaderCellProps<TableDataType, FooterDataType> {
  additionalFilterKeys?: string[]
  filterKey?: string
  filterOptions?: OptType[]
  getFilterValue?: ((item: OptType) => string) | string | undefined
  getIcon?: (item: OptType) => ReactNode
  getItemLabel?: ((item: OptType) => string) | string | undefined
  isFilterLocked?: boolean
  renderFilterKey?: (key: string, value: unknown) => string
  selectedFilters?: string[]
}
export type TableColumnType<
  TableDataType = Record<string, unknown>,
  OptType extends GenericOptionsType = GenericOptionsType,
  FooterDataType = Record<string, unknown>,
> = FilteredTableHeaderCellProps<TableDataType, FooterDataType, OptType>

export type TableProps<
  TableDataType = Record<string, unknown>,
  OptType extends GenericOptionsType = GenericOptionsType,
  FooterDataType = Record<string, unknown>,
> = {
  loading?: boolean
  data: TableDataType[]
  columns: TableColumnType<TableDataType, OptType, FooterDataType>[]
  selectedRows?: (string | number)[]

  loadingRows?: number
  headerBackground?: string
  footerBackground?: BoxProps['bgcolor']
  noResultsLabel?: string
  clearFilersOnNoResultLabel?: string

  disableSelection?: boolean
  disableNoResults?: boolean
  disableTableHeader?: boolean
  disableClearFiltersOnNoResults?: boolean
  filters?: FilterType[]

  footerData?: Record<string, unknown>
  getTrLeftBorderColor?: string | ((item: TableDataType, idx: number) => string)
  getTrProps?: (
    item: Record<string, unknown>,
    idx: number
  ) => Record<string, unknown>
  getSelectedRow?: string | ((item: TableDataType, idx: number) => string)
  onUnselectAllFilters?: () => void
  onReorder?: (itemFrom: unknown, itemTo: unknown) => void
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
  disableSelectAll?: boolean
}
