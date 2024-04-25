import { FilterType } from './types'
import { TableUiType } from './useTableController'

export type MakeFilterUrlParams = {
  url: string

  searchValue?: string
  externalFilters?: FilterType[]
  disablePagination?: boolean
  preprocessFilters?: (filters: FilterType[]) => FilterType[]
  postprocessFilters?: (filters: FilterType[]) => FilterType[]
  searchParamIn?: TableUiType['searchParam']
  allFilters?: TableUiType['allFilters']
  pageNumber: number
  itemsPerPage: number
}
export const makeFilterUrl = (params: MakeFilterUrlParams) => {
  const {
    url,
    searchValue,
    externalFilters,
    disablePagination,
    preprocessFilters,
    postprocessFilters,
    searchParamIn,
    allFilters,
    pageNumber = 1,
    itemsPerPage = 20,
  } = params

  const searchParam = searchValue ?? searchParamIn
  const searchTerms = !searchParam
    ? ''
    : 'search_term=' +
      searchParam
        .split(' ')
        .filter((searchTerm) => searchTerm !== '')
        .join('&search_term=')

  const transformedExternalFilters =
    preprocessFilters && externalFilters
      ? preprocessFilters?.(externalFilters)
      : externalFilters
  const transformedInternalFilters = preprocessFilters
    ? preprocessFilters?.(allFilters ?? [])
    : allFilters

  const adjInternalFilters = transformedInternalFilters?.filter((uiFilter) =>
    !transformedExternalFilters?.length
      ? true
      : !transformedExternalFilters?.find(
          (externalFilter) => externalFilter.filterKey === uiFilter?.filterKey
        ) ||
        transformedExternalFilters?.find(
          (externalFilter) =>
            externalFilter.filterKey === uiFilter?.filterKey &&
            uiFilter?.value === externalFilter?.value
        )
  )
  const adjPostProcessedInternalFilters = postprocessFilters
    ? postprocessFilters(adjInternalFilters ?? [])
    : adjInternalFilters
  const filterTermArray = adjPostProcessedInternalFilters?.map(
    (filter, fIdx) => `${!fIdx ? '' : '&'}${filter?.filterKey}=${filter.value}`
  )

  const filterTerms = filterTermArray?.join?.('') || ''
  const externalFilterTermArray = (
    transformedExternalFilters?.length
      ? transformedExternalFilters?.filter(
          (externalFilter) =>
            !transformedInternalFilters?.find(
              (uiFilter) => uiFilter?.filterKey === externalFilter.filterKey //&& uiFilter?.value === externalFilter?.value
            )
        )
      : []
  )
    // ? []
    // : transformedExternalFilters
    ?.map(
      (externalFilter, eIdx) =>
        `${!eIdx ? '' : '&'}${externalFilter?.filterKey}=${
          externalFilter.value
        }`
    )
  const externalFilterTerms = externalFilterTermArray?.join?.('') ?? ''

  const fullUrl = disablePagination
    ? `${url}?${searchTerms}${
        filterTerms && searchTerms ? '&' : ''
      }${filterTerms}${
        externalFilterTerms && (searchTerms || filterTerms) ? '&' : ''
      }${externalFilterTerms}`
    : `${url}?page_number=${pageNumber}&page_size=${itemsPerPage}${
        searchTerms ? '&' : ''
      }${searchTerms}${filterTerms ? '&' : ''}${filterTerms}${
        externalFilterTerms ? '&' : ''
      }${externalFilterTerms}`
  const paramsString = disablePagination
    ? `${searchTerms}${filterTerms && searchTerms ? '&' : ''}${filterTerms}${
        externalFilterTerms && (searchTerms || filterTerms) ? '&' : ''
      }${externalFilterTerms}`
    : `page_number=${pageNumber}&page_size=${itemsPerPage}${
        searchTerms ? '&' : ''
      }${searchTerms}${filterTerms ? '&' : ''}${filterTerms}${
        externalFilterTerms ? '&' : ''
      }${externalFilterTerms}`
  const unpaginatedParamsString = `${searchTerms}${
    !searchTerms ? '' : '&'
  }${filterTerms}${
    (!searchTerms && !filterTerms) || !externalFilterTerms ? '' : '&'
  }${externalFilterTerms}`

  return {
    fullUrl,
    paramsString,
    unpaginatedParamsString,
  }
}
