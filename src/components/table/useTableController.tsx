import {
  useRef,
  useCallback,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  useState,
  useMemo,
} from 'react'
import { FilterType } from './types'
import { makeFilterUrl } from './makeUrl'
import { isEqual } from 'lodash'

export type TableUiType = {
  searchValue: string // input value + pressed enter / blur field
  searchParam: string // input value
  pageNumber: number
  itemsPerPage: number
  filters: FilterType[]
}

type GenericFilterType = { filterKey: string; value: any }

export type TableHookProps = {
  onStartLoading?: () => void
  onFetch: (url: string, srcUrl?: string) => void
  url: string
  externalFilters?: { filterKey: string; value: any }[]
  initial?: {
    filters?: { filterKey: string; value: any }[]
    searchParam?: string
    pageNumber?: number
    itemsPerPage?: number
  }
  onUpdateTableParams?: (newValue: {
    filters: { filterKey: string; value: any }[]
    searchParam: string
    pageNumber: number
    itemsPerPage: number
  }) => void
  onChangeItemsPerPage?: (newvalue: number) => void
  itemsPerPageStorageKey?: string
  preprocessFilters?: (
    filtersIn: { filterKey: string; value: any }[]
  ) => { filterKey: string; value: any }[]
  postprocessFilters?: (
    filtersIn: { filterKey: string; value: any }[]
  ) => { filterKey: string; value: any }[]
  searchValue?: string
  isUnpaginated?: boolean
  disablePagination?: boolean
  scrollContainer?: any
}

export const useTableUi = (props: TableHookProps) => {
  const {
    externalFilters,
    url,
    onFetch,
    onStartLoading,
    initial,
    onUpdateTableParams,
    onChangeItemsPerPage,
    itemsPerPageStorageKey,
    preprocessFilters,
    postprocessFilters,
    searchValue,
    isUnpaginated,
    disablePagination,
    scrollContainer,
  } = props ?? {}
  const {
    filters: initialAllFilters,
    searchParam: initialSearchParam,
    pageNumber: initialPageNumber,
  } = initial || {}
  // const { paginationSize } =
  //   JSON?.parse?.(localStorage?.getItem?.('userSettings') || '{}') || {}
  // const specificPaginationSize =
  //   !!itemsPerPageStorageKey && paginationSize?.[itemsPerPageStorageKey]

  const [tableUi, setTableUi] = useState<TableUiType>({
    searchValue: searchValue ?? initialSearchParam ?? '',
    searchParam: searchValue ?? initialSearchParam ?? '',
    pageNumber: initialPageNumber ?? 1,
    itemsPerPage: isUnpaginated ? 999999 : /*specificPaginationSize ||*/ 20,
    filters: initialAllFilters ?? [],
  })

  const handleSeachChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!value && value !== '') return
    setTableUi((current) => ({ ...current, searchValue: value }))
  }, [])

  // event (params) looks different now
  const handleSeachParamChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!value && value !== '') return
      setTableUi((current) => {
        onUpdateTableParams?.({
          filters: current?.filters,
          searchParam: value,
          pageNumber: current?.pageNumber,
          itemsPerPage: current?.itemsPerPage,
        })
        return { ...current, searchParam: value }
      })
    },
    [onUpdateTableParams]
  )

  const handleSearchKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement> & ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!value && value !== '') return
      if (
        (e?.type !== 'keyup' && e?.type !== 'blur') ||
        (e?.type === 'keyup' && e?.key !== 'Enter')
      )
        return
      setTableUi((current) => {
        onUpdateTableParams?.({
          filters: current?.filters,
          searchParam: value,
          pageNumber: current?.pageNumber,
          itemsPerPage: current?.itemsPerPage,
        })
        return { ...current, pageNumber: 1, searchParam: value }
      })
    },
    [onUpdateTableParams]
  )
  const clearFilters = useCallback(() => {
    setTableUi((current) => {
      onUpdateTableParams?.({
        filters: [],
        searchParam: current?.searchParam,
        pageNumber: current?.pageNumber ?? 1,
        itemsPerPage: current?.itemsPerPage,
      })
      return { ...current, filters: [] }
    })
  }, [onUpdateTableParams])

  const makeUrl = useCallback(() => {
    const { fullUrl, paramsString, unpaginatedParamsString } = makeFilterUrl({
      disablePagination,
      externalFilters,
      searchValue: searchValue ?? tableUi?.searchParam,
      postprocessFilters,
      preprocessFilters,
      url,
      pageNumber: tableUi?.pageNumber,
      itemsPerPage: tableUi?.itemsPerPage,
      filters: tableUi?.filters,
    })
    return {
      fullUrl,
      paramsString,
      unpaginatedParamsString,
    }
  }, [
    externalFilters,
    url,
    preprocessFilters,
    searchValue,
    postprocessFilters,
    disablePagination,
    tableUi?.pageNumber,
    tableUi?.itemsPerPage,
    tableUi?.filters,
    tableUi?.searchParam,
  ])

  useEffect(() => {
    if (searchValue === undefined) return
    setTableUi((current) => {
      onUpdateTableParams?.({
        filters: current?.filters,
        searchParam: searchValue,
        pageNumber: current?.pageNumber,
        itemsPerPage: current?.itemsPerPage,
      })
      return { ...current, pageNumber: 1, searchParam: searchValue }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  // const lastItems = useRef<any[]>([null, null, null, null])
  // const calls = useRef(0)

  // const info = useReactiveInfo2([onFetch, onStartLoading, makeUrl, url])

  const handleFetchTableData = useCallback(async () => {
    onStartLoading?.()
    const { fullUrl: urlAdj } = makeUrl()

    // calls.current++
    // lastItems.current = [
    //   externalFilters,
    //   url,
    //   preprocessFilters,
    //   searchValue,
    //   postprocessFilters,
    //   disablePagination,
    //   tableUi?.pageNumber,
    //   tableUi?.itemsPerPage,
    //   tableUi?.filters,
    //   tableUi?.searchParam,
    //   makeUrl,
    // ]
    return await onFetch(urlAdj, url)
  }, [onFetch, onStartLoading, makeUrl, url])

  useEffect(() => {
    handleFetchTableData()
  }, [handleFetchTableData])

  // migration Function
  const setFilters = useCallback(
    (
      newValue:
        | ((current: GenericFilterType[]) => GenericFilterType[])
        | GenericFilterType[]
    ) => {
      setTableUi((current) => {
        const newFiltersValue =
          typeof newValue === 'function'
            ? newValue?.(current?.filters)
            : newValue
        onUpdateTableParams?.({
          filters: newFiltersValue,
          searchParam: current?.searchParam ?? '',
          pageNumber: current?.pageNumber ?? 1,
          itemsPerPage: current?.itemsPerPage,
        })
        return {
          ...current,
          filters: newFiltersValue,
          pageNumber: 1,
        }
      })
    },
    [onUpdateTableParams]
  )
  const changePageNumber = useCallback(
    (newValue: ((current: number) => number) | number) => {
      setTableUi((current) => {
        const newPageNumber =
          typeof newValue === 'function'
            ? newValue(current?.pageNumber)
            : newValue
        onUpdateTableParams?.({
          filters: current?.filters,
          searchParam: current?.searchParam,
          pageNumber: newPageNumber,
          itemsPerPage: current?.itemsPerPage,
        })
        // Scroll to a certain element
        const scroollContainerElement = document.querySelector(
          `#${scrollContainer ?? 'scroll_container'}`
        )
        if (scroollContainerElement)
          scroollContainerElement.scrollTo({
            top: 0, // could be negative value
            left: 0,
            behavior: 'smooth',
          })

        return {
          ...current,
          pageNumber: newPageNumber,
        }
      })
    },
    [onUpdateTableParams, scrollContainer]
  )
  const changeItemsPerPage = useCallback(
    (newValue: ((current: number) => number) | number) => {
      setTableUi((current) => {
        const newValueAdj =
          typeof newValue === 'function'
            ? newValue(current?.itemsPerPage)
            : newValue
        onChangeItemsPerPage?.(newValueAdj)
        // if (itemsPerPageStorageKey) {
        //   const current =
        //     JSON?.parse?.(localStorage?.getItem?.('userSettings') || '{}') || {}
        //   const newPrefs = {
        //     paginationSize: {
        //       ...current?.paginationSize,
        //       [itemsPerPageStorageKey]: newValueAdj || 20,
        //     },
        //   }
        //   localStorage.setItem('userSettings', JSON.stringify(newPrefs))
        // }
        return {
          ...current,
          itemsPerPage: newValueAdj,
        }
      })
    },
    [onChangeItemsPerPage]
  )

  const UrlParams = useMemo(() => makeUrl(), [makeUrl])

  return {
    tableUi,
    setTableUi,
    handleSeachChange,
    handleSeachParamChange,
    handleSearchKeyUp,
    clearFilters,
    setFilters,
    updateData: handleFetchTableData,
    changePageNumber,
    changeItemsPerPage,
    UrlParams,
  }
}
