import { render, fireEvent, act, getByTestId } from '@testing-library/react'
import { FilteredTableHeaderCell } from '../subComponents/FilteredColumns'
import {
  mdiArrowDownThin,
  mdiArrowUpThin,
  mdiCheck,
  mdiLock,
  mdiMinus,
} from '@mdi/js'
import { add } from 'lodash'

const FILTER_KEY = 'test_filter_key'
const SORT_KEY = 'test_sort_key'
const HEADER_LABEL = 'Test Header Label'
const FILTER_OPTIONS = [
  {
    label: 'test_label_1',
    value: 'test_value_1',
    icon: 'mdi_icon_1',
  },
  {
    label: 'test_label_2',
    value: 'test_value_2',
    icon: 'mdi_icon_2',
  },
]

const FixtureComponent = (props: Record<string, any>) => {
  return (
    <FilteredTableHeaderCell
      header={HEADER_LABEL}
      filterKey={FILTER_KEY}
      sortKey={SORT_KEY}
      //
      getFilterValue={(opt) => opt.value}
      getIcon={(opt) => opt.icon}
      getItemLabel={(opt) => opt.label}
      //   renderFilterKey={() => {}}
      isFilterLocked={false}
      open={false}
      allFilters={[]}
      filterOptions={FILTER_OPTIONS}
      selectedFilter={[]}
      headerToolTip="test_tooltip"
      //   additionalFilterKeys={}
      // disableTableHeader
      {...props}
    />
  )
}
const renderFixture = (
  overrideProps?: Record<string, any>,
  rerender?: () => any
): ReturnType<typeof render> & {
  handleOnClose: jest.Mock<any, any>
  handleOnOpen: jest.Mock<any, any>
  handleSetAllFilters: jest.Mock<any, any>
  handleChangeSorting: jest.Mock<any, any>
  handleChangePageNumber: jest.Mock<any, any>
  onSetAllFilters: jest.Mock<any, any>
} => {
  const handleOnClose = jest.fn()
  const handleOnOpen = jest.fn()
  const handleSetAllFilters = jest.fn()
  const handleChangeSorting = jest.fn()
  const handleChangePageNumber = jest.fn()
  const onSetAllFilters = jest.fn()
  const renderResult = (rerender || render)(
    <FixtureComponent
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      changeSorting={handleChangeSorting}
      setAllFilters={handleSetAllFilters}
      onSetAllFilters={onSetAllFilters}
      setPageNumber={handleChangePageNumber}
      {...overrideProps}
    />
  )
  return {
    ...renderResult,
    handleOnClose,
    handleOnOpen,
    handleSetAllFilters,
    handleChangeSorting,
    handleChangePageNumber,
    onSetAllFilters,
  }
}

describe('FilteredTableHeaderCell', () => {
  it('renders with correct initial values', () => {
    const { getByText, getByTestId } = renderFixture()
    const tdElement = getByTestId('filter-' + FILTER_KEY)
    expect(tdElement).toBeInTheDocument()
    const headerPElement = getByText(HEADER_LABEL)
    expect(headerPElement).toBeInTheDocument()

    const sortButtonElement = getByTestId('sort-' + SORT_KEY)
    expect(sortButtonElement).toBeInTheDocument()

    const filterButtonElement = getByTestId('filter-btn-' + FILTER_KEY)
    expect(filterButtonElement).toBeInTheDocument()
  })

  it('calls changeSorting when the sorting Button is clicked', async () => {
    const { getByText, getByTestId, handleChangeSorting } = renderFixture()
    const sortButtonElement = getByTestId('sort-' + SORT_KEY)
    const sortingIconElement = document.querySelector('path')
    expect(sortingIconElement).toHaveAttribute('d', mdiMinus)
    await act(async () => {
      fireEvent.click(sortButtonElement, { button: 0 })
    })
    expect(handleChangeSorting).toHaveBeenCalledWith(SORT_KEY)
  })

  it('renders the correct sorting icons', async () => {
    const { rerender } = renderFixture({
      allFilters: [{ filterKey: 'sorting', value: `${SORT_KEY},asc` }],
    })
    const sortingIconElement = document.querySelector('path')
    expect(sortingIconElement).toHaveAttribute('d', mdiArrowDownThin)
    renderFixture(
      {
        allFilters: [{ filterKey: 'sorting', value: `${SORT_KEY},desc` }],
      },
      rerender
    )
    const sortingIconElement2 = document.querySelector('path')
    expect(sortingIconElement2).toHaveAttribute('d', mdiArrowUpThin)
  })

  it('will call onOpen on click on td OR the filter icon', async () => {
    const { handleOnOpen } = renderFixture({
      allFilters: [{ filterKey: 'sorting', value: `${SORT_KEY},asc` }],
    })
    const td = document.querySelector('td')
    const filterButtonElement = document.querySelectorAll('button')?.[1]
    await act(async () => {
      fireEvent.click(td, { button: 0 })
      fireEvent.click(filterButtonElement, { button: 0 })
    })
    expect(handleOnOpen).toHaveBeenCalledTimes(2)
  })
  it('will not open and show a locked icon if isFilterLocked is passed', async () => {
    const { handleOnOpen } = renderFixture({
      isFilterLocked: true,
    })
    const td = document.querySelector('td')
    const filterButtonElement = document.querySelectorAll('button')?.[1]
    await act(async () => {
      fireEvent.click(td, { button: 0 })
      fireEvent.click(filterButtonElement, { button: 0 })
    })
    expect(handleOnOpen).toHaveBeenCalledTimes(0)
    const allPathElements = document.querySelectorAll('path')
    const lastPathElement = allPathElements[allPathElements.length - 1]
    expect(lastPathElement).toHaveAttribute('d', mdiLock)
  })

  it('renders with filter-dropdown-menu correctly', () => {
    const { getByText, getByTestId } = renderFixture({
      allFilters: [
        {
          filterKey: FILTER_KEY,
          value: 'test_value_1',
        },
        {
          filterKey: FILTER_KEY,
          value: 'test_value_2',
        },
      ],
      filterOptions: FILTER_OPTIONS,
      selectedFilter: ['test_value_1'],
      open: true,
    })
    const popoverMenuDivElement = getByTestId(
      'filter-' + FILTER_KEY + '-popover'
    ) // filter-end_date-popover
    expect(popoverMenuDivElement).toBeInTheDocument()
    const selectAllFiltersButton = getByText('Select All filters')
    const removeAllFiltersButton = getByText('Remove all filters')
    expect(selectAllFiltersButton).toBeInTheDocument()
    expect(removeAllFiltersButton).toBeInTheDocument()
    const filterInputElement = popoverMenuDivElement.querySelector('input')
    expect(filterInputElement).toBeInTheDocument()

    const filterElement1 = getByText('test_label_1')
    expect(filterElement1).toBeInTheDocument()
    const filterElement2 = getByText('test_label_2')
    expect(filterElement2).toBeInTheDocument()

    const optionIconElement1 = getByText('mdi_icon_1')
    expect(optionIconElement1).toBeInTheDocument()

    const optionIconElement2 = getByText('mdi_icon_2')
    expect(optionIconElement2).toBeInTheDocument()

    const filterListElement1 = filterElement1?.parentElement?.parentElement
    const pathD = filterListElement1?.querySelector('path')?.getAttribute('d')
    expect(pathD).toBe(mdiCheck)
  })
  it('considers additional filter (e.g. from external component/filter) when passed as additionalFilterKeys for select all event', async () => {
    const initialFilters = [
      {
        filterKey: 'category',
        value: 'cat_123',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      //   {
      //     filterKey: FILTER_KEY,
      //     value: 'test_value_2',
      //   },
    ]

    const {
      getByText,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
    } = renderFixture({
      open: true,
      allFilters: initialFilters,
      filterOptions: FILTER_OPTIONS,
      selectedFilter: ['test_value_1'],
      additionalFilterKeys: ['category'],
    })
    const selectAllFiltersButton = getByText('Select All filters')
    await act(async () => {
      await fireEvent.click(selectAllFiltersButton, { button: 0 })
    })

    expect(handleSetAllFilters).toHaveBeenCalledWith(expect.any(Function)) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith([
      ...initialFilters,
      {
        filterKey: 'test_filter_key',
        value: 'test_value_2',
      },
    ])
    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })

  it('considers additional filter (e.g. from external component/filter) when passed as additionalFilterKeys for UNselect all event', async () => {
    const initialFilters = [
      {
        filterKey: 'category',
        value: 'cat_123',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
    ]

    const {
      getByText,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
    } = renderFixture({
      allFilters: initialFilters,
      open: true,
      selectedFilter: ['test_value_1'],
      getByTestId,
      additionalFilterKeys: ['category'],
    })
    const unselectAllFiltersButton = getByText('Remove all filters')
    await act(async () => {
      await fireEvent.click(unselectAllFiltersButton, { button: 0 })
    })

    expect(handleSetAllFilters).toHaveBeenCalledWith(expect.any(Function)) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith([])
    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })

  it('calls the onChange fns when an option is focused and keyup', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_2',
      },
    ]
    const {
      getByText,
      getByTestId,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
    } = renderFixture({
      allFilters: initialFilters,
      open: true,
    })
    const filterElement1 = getByText('test_label_1')
    const filterButtonElement1 = filterElement1?.parentElement?.parentElement
    expect(filterButtonElement1?.tagName).toBe('LI')

    await act(async () => {
      await fireEvent.keyUp(filterButtonElement1, { key: 'Enter' })
    })

    expect(handleSetAllFilters).toHaveBeenCalledWith(expect.any(Function)) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith([
      ...initialFilters,
      {
        filterKey: 'test_filter_key',
        value: 'test_value_1',
      },
    ])

    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })

  it('calls the onChange fns when an option is clicked and selected', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_2',
      },
    ]

    const {
      getByText,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
    } = renderFixture({
      allFilters: initialFilters,
      open: true,
    })

    const filterElement1 = getByText('test_label_1')
    const filterButtonElement1 = filterElement1?.parentElement?.parentElement
    expect(filterButtonElement1?.tagName).toBe('LI')

    await act(async () => {
      await fireEvent.click(filterButtonElement1, { button: 0 })
    })

    expect(handleSetAllFilters).toHaveBeenCalledWith(expect.any(Function)) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith([
      ...initialFilters,
      {
        filterKey: 'test_filter_key',
        value: 'test_value_1',
      },
    ])

    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })

  it('calls the onChange fns when an option is clicked and UNselected', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_2',
      },
    ]

    const {
      getByText,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
    } = renderFixture({
      open: true,
      allFilters: initialFilters,
      selectedFilter: ['test_value_1'],
    })

    const filterElement1 = getByText('test_label_1')
    const filterButtonElement1 = filterElement1?.parentElement?.parentElement
    expect(filterButtonElement1?.tagName).toBe('LI')

    await act(async () => {
      await fireEvent.click(filterButtonElement1, { button: 0 })
    })

    const newFilters = initialFilters.filter((f) => f.value !== 'test_value_1')
    expect(handleSetAllFilters).toHaveBeenCalledWith(newFilters) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith(newFilters)

    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })

  it('has a buttons to select all of this column filter', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
    ]
    const {
      getByText,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
    } = renderFixture({
      open: true,
      allFilters: initialFilters,
      selectedFilter: ['test_value_1'],
    })

    const selectAllFiltersButton = getByText('Select All filters')

    await act(async () => {
      await fireEvent.click(selectAllFiltersButton, { button: 0 })
    })

    expect(handleSetAllFilters).toHaveBeenCalledWith(expect.any(Function)) // uses SetState callback
    const callbackSetFilters = handleSetAllFilters.mock.lastCall?.[0]
    const newFilters = callbackSetFilters(initialFilters)
    expect(newFilters).toEqual([
      {
        filterKey: 'test_filter_key',
        value: 'test_value_1',
      },
      {
        filterKey: 'test_filter_key',
        value: 'test_value_2',
      },
    ]) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith([
      ...initialFilters,
      {
        filterKey: 'test_filter_key',
        value: 'test_value_2',
      },
    ])

    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })
  it('has a buttons to UNselect all of this column filter', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: 'additional_filter_key',
        value: 'test_value_1A',
      },
      {
        filterKey: 'some_other_filter',
        value: 'test_value_1_SO',
      },
    ]
    const {
      getByText,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
    } = renderFixture({
      open: true,
      allFilters: initialFilters,
      selectedFilter: ['test_value_1'],
      additionalFilterKeys: ['additional_filter_key'],
    })
    const removeAllFiltersButton = getByText('Remove all filters')
    await act(async () => {
      await fireEvent.click(removeAllFiltersButton, { button: 0 })
    })

    const callbackSetFilters = handleSetAllFilters.mock.lastCall?.[0]
    const newFilters = callbackSetFilters(initialFilters)
    expect(newFilters).toEqual([
      {
        filterKey: 'some_other_filter',
        value: 'test_value_1_SO',
      },
    ]) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith([
      {
        filterKey: 'some_other_filter',
        value: 'test_value_1_SO',
      },
    ])

    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })

  it('filters the dropdowns entrys using the search field', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_2',
      },
    ]
    const { getByText, queryByText } = renderFixture({
      open: true,
      allFilters: initialFilters,
      selectedFilter: [],
    })
    const searchFieldInputElement = document.querySelector('input')
    expect(searchFieldInputElement).toBeInTheDocument()

    await act(async () => {
      await fireEvent.change(searchFieldInputElement, {
        target: { value: 'test_label_1' },
      })
    })
    await act(async () => {
      await fireEvent.keyUp(searchFieldInputElement, {
        target: { value: 'test_label_1' },
      })
    })

    const filterElement1 = getByText('test_label_1')
    expect(filterElement1).toBeInTheDocument()
    const filterElement2 = queryByText('test_label_2')
    expect(filterElement2).not.toBeInTheDocument()
  })

  it('search input triggers filter ops for the when enter keyup ', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_2',
      },
    ]
    const {
      getByText,
      handleSetAllFilters,
      onSetAllFilters,
      handleChangePageNumber,
    } = renderFixture({
      open: true,
      allFilters: initialFilters,
      selectedFilter: ['test_value_1'],
    })
    const searchFieldInputElement = document.querySelector('input')
    expect(searchFieldInputElement).toBeInTheDocument()

    await act(async () => {
      await fireEvent.change(searchFieldInputElement, {
        target: { value: 'test_label_1' },
      })
    })
    await act(async () => {
      await fireEvent.keyUp(searchFieldInputElement, {
        key: 'Enter',
        target: { value: 'test_value_1' },
      })
    })
    const newFilters = initialFilters.filter((f) => f.value !== 'test_value_1')
    expect(handleSetAllFilters).toHaveBeenCalledWith([
      { filterKey: 'test_filter_key', value: 'test_value_2' },
    ]) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith([
      { filterKey: 'test_filter_key', value: 'test_value_2' },
    ])

    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
  })

  it('restores the filter values in the dropdown from initial render when onClick on Cancel', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_2',
      },
    ]

    const {
      getByText,
      handleSetAllFilters,
      handleChangePageNumber,
      onSetAllFilters,
      handleOnClose,
    } = renderFixture({
      open: true,
      allFilters: initialFilters,
      selectedFilter: [],
    })

    const cancelButtonElement = getByText('Cancel')
    expect(cancelButtonElement).toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(cancelButtonElement, { button: 0 })
    })

    expect(handleSetAllFilters).toHaveBeenCalledWith(initialFilters) // uses SetState callback
    expect(onSetAllFilters).toHaveBeenCalled()
    expect(onSetAllFilters).toHaveBeenCalledWith(initialFilters)
    expect(handleChangePageNumber).toHaveBeenCalledWith(1)
    expect(handleOnClose).toHaveBeenCalled()
  })
  it('calls onClose on Ok', async () => {
    const initialFilters = [
      {
        filterKey: FILTER_KEY,
        value: 'test_value_1',
      },
      {
        filterKey: FILTER_KEY,
        value: 'test_value_2',
      },
    ]

    const { getByText, handleOnClose } = renderFixture({
      allFilters: initialFilters,
      selectedFilter: [],
      open: true,
    })

    const okButtonElement = getByText('Ok')
    expect(okButtonElement).toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(okButtonElement, { button: 0 })
    })

    expect(handleOnClose).toHaveBeenCalled()
  })

  // Continue with tests for other properties...
})
