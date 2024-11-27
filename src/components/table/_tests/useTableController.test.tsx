import { render, act, fireEvent } from '@testing-library/react'
import { Table } from '../Table'
import { TableHookProps, useTableUi } from '../useTableController'
import { Button } from '@mui/material'
import { GenericFilterType } from '../types'

const BASE_URL = '__test_url__'
const EMPTY_ARRAY: any[] = []
const SET_ALL_FILTERS_TEST: GenericFilterType[] = [
  { filterKey: 'filter_key', value: 'filter_value' },
  { filterKey: 'filter_key2', value: 'filter_value2' },
]

const makeFullUrl = (params?: { [key: string]: string }) => {
  const newParams: { [key: string]: string | number } = {
    page_number: 1,
    page_size: 20,
    ...(params ?? {}),
  }
  const otherParams = Object.keys(newParams ?? {})
    .map((key) => `${key}=${newParams?.[key]}`)
    .join('&')
  return (
    `${BASE_URL}` +
    (Object.keys(newParams ?? {}).length ? `?${otherParams}` : '')
  )
}

const TestComponent = (props: Partial<TableHookProps>) => {
  //   const handleOnFetch = jest.fn()
  //   const handleChangeItemsPerPage = jest.fn()

  const params: TableHookProps = {
    // onFetch: handleOnFetch,
    url: BASE_URL,
    disablePagination: false,

    // searchValue: '',
    // scrollContainer
    externalFilters: EMPTY_ARRAY,
    // isUnpaginated
    // initial
    // itemsPerPageStorageKey
    // onChangeItemsPerPage
    // onStartLoading
    // onUpdateTableParams
    // postprocessFilters
    // onChangeItemsPerPage: handleChangeItemsPerPage,
    ...props,
  }
  const tableController = useTableUi(params)
  const {
    tableUi,
    setTableUi,
    setFilters,
    changeItemsPerPage,
    changePageNumber,
    clearFilters,
    handleSeachChange,
    handleSeachParamChange,
    handleSearchKeyUp,
    updateData,
    // UrlParams,
  } = tableController

  return (
    <div id="test_scroll_container">
      <Table
        data={[]}
        columns={[]}
        loading={false}
        filters={tableUi.filters as any}
        onSetFilters={setFilters}

        // clearFilters={clearFilters}
        // setPageNumber={changePageNumber}
      />
      <Button onClick={() => updateData()}>Update Data</Button>
      <Button
        onClick={() =>
          handleSeachChange({ target: { value: 'new_search_value' } } as any)
        }
      >
        Change Search Value
      </Button>
      <Button
        onClick={() =>
          handleSeachParamChange({
            target: { value: 'new_search_param' },
          } as any)
        }
      >
        Change Search Param
      </Button>
      <Button onClick={() => setFilters(SET_ALL_FILTERS_TEST)}>
        Set All Filter
      </Button>
      <Button
        onClick={() =>
          handleSearchKeyUp({
            target: { value: 'search_key' },
            type: 'keyup',
            key: 'Enter',
          } as any)
        }
      >
        On Enter
      </Button>
      <Button
        onClick={() =>
          handleSearchKeyUp({
            target: { value: 'search_key_some' },
            type: 'keyup',
            key: 'c',
          } as any)
        }
      >
        On Key
      </Button>
      <Button
        onClick={() =>
          handleSearchKeyUp({
            target: { value: 'search_key_blur' },
            type: 'blur',
            // key: 'Enter',
          } as any)
        }
      >
        On Blur
      </Button>
      <Button onClick={() => clearFilters()}>Clear Filters</Button>

      <Button onClick={() => changePageNumber(2)}>Change PageNumber</Button>
      <Button onClick={() => changeItemsPerPage(100)}>
        Change ItemsPerPage
      </Button>
    </div>
  )
}

const renderFixture = (
  overrideProps?: Partial<TableHookProps>,
  rerender?: () => any
): ReturnType<typeof render> & {
  handleOnFetch: jest.Mock
  handleOnUpdateTableParams: jest.Mock
  handleOnStartLoading: jest.Mock
  handleOnChangeItemsPerPage: jest.Mock
} => {
  const handleOnFetch = jest.fn()
  const handleOnStartLoading = jest.fn()
  const handleOnUpdateTableParams = jest.fn()
  const handleOnChangeItemsPerPage = jest.fn()
  const renderResult = (rerender || render)(
    <TestComponent
      onFetch={handleOnFetch}
      onStartLoading={handleOnStartLoading}
      onUpdateTableParams={handleOnUpdateTableParams}
      onChangeItemsPerPage={handleOnChangeItemsPerPage}
      {...overrideProps}
    />
  )

  return {
    ...renderResult,
    handleOnFetch,
    handleOnStartLoading,
    handleOnUpdateTableParams,
    handleOnChangeItemsPerPage,
  }
}

describe('TableController', () => {
  it('renders correctly', () => {
    const {
      getByText,
      handleOnFetch,
      handleOnStartLoading,
      handleOnUpdateTableParams,
      //   handleClearFilters,
    } = renderFixture()
    expect(getByText('No results found')).toBeInTheDocument()
    expect(handleOnFetch).toHaveBeenCalledTimes(1)
    const url = makeFullUrl()
    expect(handleOnFetch).toHaveBeenCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(1)
  })
  it('triggers an onFetch(url: string) when updateDate() is called', async () => {
    const {
      getByText,
      handleOnFetch,
      handleOnStartLoading,
      handleOnUpdateTableParams,
    } = renderFixture()
    const dummyButtonElementUpdateData = getByText('Update Data')
    expect(dummyButtonElementUpdateData).toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(dummyButtonElementUpdateData)
    })

    expect(handleOnFetch).toHaveBeenCalledTimes(2)
    const url = makeFullUrl()
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(2)
  })

  it('will add a search_term= string to the urls when handleSeachParamChange is triggered', async () => {
    const {
      getByText,
      handleOnFetch,
      handleOnStartLoading,
      handleOnUpdateTableParams,
    } = renderFixture()
    const dummyButtonElementUpdateData = getByText('Change Search Param')
    expect(dummyButtonElementUpdateData).toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(dummyButtonElementUpdateData)
    })

    expect(handleOnFetch).toHaveBeenCalledTimes(2)
    const url = makeFullUrl({
      search_term: 'new_search_param',
    })
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(2)

    expect(handleOnUpdateTableParams).toHaveBeenCalledTimes(1)
    expect(handleOnUpdateTableParams).toHaveBeenCalledWith({
      filters: [],
      searchParam: 'new_search_param',
      pageNumber: 1,
      itemsPerPage: 20,
    })
  })

  it('will add a search_term= string to the urls when handleSeachParamChange is triggered via KEYUP handlers', async () => {
    const {
      getByText,
      handleOnFetch,
      handleOnStartLoading,
      handleOnUpdateTableParams,
      rerender,
    } = renderFixture()
    const dummyButtonElementUpdateData = getByText('On Enter')
    expect(dummyButtonElementUpdateData).toBeInTheDocument()
    await act(async () => {
      await fireEvent.click(dummyButtonElementUpdateData)
    })

    expect(handleOnFetch).toHaveBeenCalledTimes(2)
    const url = makeFullUrl({
      search_term: 'search_key', // from dummy button
    })
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(2)

    expect(handleOnUpdateTableParams).toHaveBeenCalledTimes(1)
    expect(handleOnUpdateTableParams).toHaveBeenCalledWith({
      filters: [],
      searchParam: 'search_key',
      pageNumber: 1,
      itemsPerPage: 20,
    })
    const dummyButtonElement = getByText('On Key')
    expect(dummyButtonElement).toBeInTheDocument()
    await act(async () => {
      await fireEvent.click(dummyButtonElement)
    })
    expect(handleOnFetch).toHaveBeenCalledTimes(2)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(2)
    expect(handleOnUpdateTableParams).toHaveBeenCalledTimes(1)
    const dummyButtonElement2 = getByText('On Blur')
    expect(dummyButtonElement2).toBeInTheDocument()
    await act(async () => {
      await fireEvent.click(dummyButtonElement2)
    })
    expect(handleOnFetch).toHaveBeenCalledTimes(3)
    const url3 = makeFullUrl({
      search_term: 'search_key_blur', // from dummy button
    })
    expect(handleOnFetch).toHaveBeenLastCalledWith(url3, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(3)
    expect(handleOnUpdateTableParams).toHaveBeenCalledTimes(2)
  })

  it('will only change the ui state if handleSeachChange is triggered', async () => {
    const {
      getByText,
      handleOnFetch,
      handleOnStartLoading,
      handleOnUpdateTableParams,
    } = renderFixture()
    const dummyButtonElementUpdateData = getByText('Change Search Value')
    expect(dummyButtonElementUpdateData).toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(dummyButtonElementUpdateData)
    })

    expect(handleOnFetch).toHaveBeenCalledTimes(1)
    const url = makeFullUrl({})
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(1)
  })

  it('will add externalFilters to onFetch(url: string)-> url and rect to changes of externalFilters', async () => {
    const externalFilters = [{ filterKey: 'filter_key', value: 'filter_value' }]
    const externalFilters2 = [
      { filterKey: 'filter_key', value: 'filter_value' },
      { filterKey: 'filter_key2', value: 'filter_value2' },
    ]
    const { handleOnFetch, handleOnStartLoading, rerender } = renderFixture({
      externalFilters,
    })
    expect(handleOnFetch).toHaveBeenCalledTimes(1)
    const url = makeFullUrl({
      filter_key: 'filter_value',
    })
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(1)

    // change externalFilters and check if updated
    const { handleOnFetch: onFetch2, handleOnStartLoading: onStartLoading2 } =
      renderFixture({ externalFilters: externalFilters2 }, rerender)
    expect(onFetch2).toHaveBeenCalledTimes(1)
    const url2 = makeFullUrl({
      filter_key: 'filter_value',
      filter_key2: 'filter_value2',
    })
    expect(onFetch2).toHaveBeenLastCalledWith(url2, BASE_URL)
    expect(onStartLoading2).toHaveBeenCalledTimes(1)
  })
  it('will add allFilters (internal) to onFetch(url: string)-> url and updates the filters with setFilters and not react to changes of inital', async () => {
    const props = {
      initial: {
        filters: [{ filterKey: 'filter_key', value: 'filter_value' }],
      },
    }
    const { handleOnFetch, handleOnStartLoading, rerender, getByText } =
      renderFixture(props)
    expect(handleOnFetch).toHaveBeenCalledTimes(1)
    const url = makeFullUrl({
      filter_key: 'filter_value',
    })
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(1)
    const dummySetAllFiltersButton = getByText('Set All Filter')
    expect(dummySetAllFiltersButton).toBeInTheDocument()
    await act(async () => {
      await fireEvent.click(dummySetAllFiltersButton)
    })
    expect(handleOnFetch).toHaveBeenCalledTimes(2)
    const url2 = makeFullUrl({
      filter_key: 'filter_value',
      filter_key2: 'filter_value2',
    })
    expect(handleOnFetch).toHaveBeenLastCalledWith(url2, BASE_URL)
  })

  it('will clearFilters when the hooks returned clearfilters is triggered ', async () => {
    const props = {
      initial: {
        filters: [{ filterKey: 'filter_key', value: 'filter_value' }],
      },
    }
    const { handleOnFetch, handleOnStartLoading, rerender, getByText } =
      renderFixture(props)
    const url0 = makeFullUrl({ filter_key: 'filter_value' })
    expect(handleOnFetch).toHaveBeenCalledTimes(1)
    expect(handleOnFetch).toHaveBeenLastCalledWith(url0, BASE_URL)

    const dummyClearFiltersButton = getByText('Clear Filters')
    expect(dummyClearFiltersButton).toBeInTheDocument()
    await act(async () => {
      await fireEvent.click(dummyClearFiltersButton)
    })

    const url = makeFullUrl()
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnFetch).toHaveBeenLastCalledWith(url, BASE_URL)
    expect(handleOnStartLoading).toHaveBeenCalledTimes(2)
  })

  it('if an (external) searchValue is passed to the hook it reacts to changes of searchValue ', async () => {
    const props = {
      searchValue: 'hi',
    }
    const props2 = {
      searchValue: 'hi ho',
    }
    const { handleOnFetch, rerender } = renderFixture(props)
    const url0 = makeFullUrl({ search_term: 'hi' })
    expect(handleOnFetch).toHaveBeenCalledTimes(1)
    expect(handleOnFetch).toHaveBeenLastCalledWith(url0, BASE_URL)

    const { handleOnFetch: onFetch2 } = renderFixture(props2, rerender)
    expect(onFetch2).toHaveBeenCalledTimes(2)
    const url2 =
      '__test_url__?page_number=1&page_size=20&search_term=hi&search_term=ho'
    expect(onFetch2).toHaveBeenLastCalledWith(url2, BASE_URL)
  })

  it('call onFetch, onUpdateTableParams when changePageNumber is triggered', async () => {
    const scrollMock = jest.fn()
    const {
      getByText,
      handleOnUpdateTableParams,
      handleOnFetch,
      handleOnStartLoading,
    } = renderFixture({ scrollContainer: 'test_scroll_container' })

    const scrollContainerElement = document.getElementById(
      'test_scroll_container'
    )
    expect(scrollContainerElement).toBeInTheDocument()
    scrollContainerElement.scrollTo = scrollMock

    const dummyButtonElement = getByText('Change PageNumber')
    expect(dummyButtonElement).toBeInTheDocument()
    await act(async () => {
      await fireEvent.click(dummyButtonElement)
    })

    // expect(scrollMock).toHaveBeenCalledTimes(1)
    // expect(scrollMock).toHaveBeenCalledWith({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth',
    // })
    expect(handleOnUpdateTableParams).toHaveBeenCalledTimes(1)
    expect(handleOnUpdateTableParams).toHaveBeenCalledWith({
      filters: [],
      searchParam: '',
      pageNumber: 2,
      itemsPerPage: 20,
    })

    expect(handleOnFetch).toHaveBeenCalledTimes(2)
    expect(handleOnFetch).toHaveBeenLastCalledWith(
      makeFullUrl({ page_number: 2, page_size: 20 }),
      BASE_URL
    )
    expect(handleOnStartLoading).toHaveBeenCalledTimes(2)
  })
  it('call onFetch, onUpdateTableParams when changeItemsPerPage is triggered', async () => {
    const {
      getByText,
      handleOnUpdateTableParams,
      handleOnFetch,
      handleOnStartLoading,
      handleOnChangeItemsPerPage,
    } = renderFixture()
    const dummyButtonElement = getByText('Change ItemsPerPage')
    expect(dummyButtonElement).toBeInTheDocument()
    await act(async () => {
      await fireEvent.click(dummyButtonElement)
    })
    expect(handleOnChangeItemsPerPage).toHaveBeenCalledTimes(1)
    expect(handleOnChangeItemsPerPage).toHaveBeenCalledWith(100)

    expect(handleOnFetch).toHaveBeenCalledTimes(2)
    expect(handleOnFetch).toHaveBeenLastCalledWith(
      makeFullUrl({ page_number: 1, page_size: 100 }),
      BASE_URL
    )
    expect(handleOnStartLoading).toHaveBeenCalledTimes(2)
  })
})
