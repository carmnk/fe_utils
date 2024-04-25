import { render, act, fireEvent } from '@testing-library/react'
import { Table } from '../Table'
import { TableProps } from '../types'

const FOOTER: TableProps['footerData'] = {
  //   title: 'footer title',
  total: '3 Items',
}
const ROWS = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
]
const COLUMNS: TableProps['columns'] = [
  {
    isRowSelect: true,
  },
  {
    header: 'ID',
    renderRow: (row) => <td>{row.id}</td>,
    // renderFooterCell: (footerData) => <td>{footerData.title}</td>,
    // additionalFilterKeys
    filterKey: 'id',
    sortKey: 'id',
  },
  {
    header: 'Name',
    // additionalFilterKeys
    renderRow: (row) => <td>{row.name}</td>,
    renderFooterCell: (footerData) => <td>{footerData.total}</td>,
    filterKey: 'name',
    sortKey: 'name',
  },
]

const FixtureComponent = (props: Partial<TableProps>) => {
  return (
    <Table
      columns={COLUMNS}
      rows={ROWS}
      allFilters={[]}
      headerBackground="red"
      disableTableHeader={false}
      disableClearFilters={false}
      disableNoResults={false}
      disableSelection={false}
      //   footer={}
      // expandedRowIds={}
      getRowColor={() => 'gray'}
      loading={false}
      noResultsLabel="There were no results found"
      //   userSortingIdFieldKey=''
      {...props}
    />
  )
}
const renderFixture = (
  overrideProps?: Partial<TableProps>,
  rerender?: () => any
): ReturnType<typeof render> & {
  handleSetPageNumber: jest.Mock<any, any>
  handleClearFilters: jest.Mock<any, any>
  handleSetAllFilters: jest.Mock<any, any>
  handleSelectAll: jest.Mock<any, any>
  handleSelectRow: jest.Mock<any, any>
  handleClearSelected: jest.Mock<any, any>
  handleExpandedRow: jest.Mock<any, any>
  handleReorder: jest.Mock<any, any>
  handleOnSetAllFilters: jest.Mock<any, any>
} => {
  const handleSetPageNumber = jest.fn()
  const handleClearFilters = jest.fn()
  const handleSetAllFilters = jest.fn()
  const handleOnSetAllFilters = jest.fn()
  const handleSelectAll = jest.fn()
  const handleSelectRow = jest.fn()
  const handleClearSelected = jest.fn()
  const handleExpandedRow = jest.fn()
  const handleReorder = jest.fn()

  const renderResult = (rerender || render)(
    <FixtureComponent
      setPageNumber={handleSetPageNumber}
      clearFilters={handleClearFilters}
      setAllFilters={handleSetAllFilters}
      onSelectAll={handleSelectAll}
      onSelectRow={handleSelectRow}
      onClearSelected={handleClearSelected}
      onExpandedRow={handleExpandedRow}
      onReorder={handleReorder}
      onSetAllFilters={handleOnSetAllFilters}
      {...overrideProps}
    />
  )
  return {
    ...renderResult,
    handleSetAllFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSelectAll,
    handleSelectRow,
    handleClearSelected,
    handleExpandedRow,
    handleReorder,
    handleOnSetAllFilters,
  }
}

describe('Table', () => {
  it('renders with correct number of rows and content', () => {
    const { getAllByRole, getByText } = renderFixture()
    // +1 for the header row
    expect(getAllByRole('row')).toHaveLength(ROWS.length + 1)
    const theadElement = document.querySelector('thead')
    const tr = theadElement?.children?.[0]
    const ths = tr?.children?.length
    expect(ths).toBe(COLUMNS.length)
    const header1 = getByText('ID')
    const header2 = getByText('Name')
    expect(header1).toBeInTheDocument()
    expect(header2).toBeInTheDocument()
    const items = ROWS.map((row) => [row.id, row.name]).flat()
    items.forEach((item) => {
      expect(getByText(item)).toBeInTheDocument()
    })
  })
  it('renders with a footer if passed', () => {
    const { getAllByRole, getByText } = renderFixture({
      footerData: FOOTER,
      footerBackground: 'blue',
    })
    // +1 for the header row, +1 for the footer row
    expect(getAllByRole('row')).toHaveLength(ROWS.length + 2)
    const tfootElement = document.querySelector('tfoot')
    expect(tfootElement).toBeInTheDocument()
    expect(tfootElement).toHaveStyle('background-color: blue;')
    const tds = tfootElement?.querySelectorAll('td')
    expect(tds).toHaveLength(COLUMNS.length)
    const items = Object.keys(FOOTER)
      .map((key) => FOOTER[key])
      .flat()
    items.forEach((item) => {
      expect(getByText(item)).toBeInTheDocument()
    })
  })
  it('renders a customizable no results note if no rows prop is empty', () => {
    const { getAllByRole, getByText, getByTestId, rerender, queryByText } =
      renderFixture({
        rows: [],
      })
    const noResultsRowLength = 1
    // +1 for the header row
    expect(getAllByRole('row')).toHaveLength(noResultsRowLength + 1)
    expect(getByTestId('row_no_result')).toBeInTheDocument()

    renderFixture(
      {
        rows: [],
        noResultsLabel: 'nothing found',
      },
      rerender as any
    )
    expect(getByText('nothing found')).toBeInTheDocument()
    renderFixture(
      {
        rows: [],
        noResultsLabel: 'nothing found',
        disableNoResults: true,
      },
      rerender as any
    )
    expect(queryByText('nothing found')).not.toBeInTheDocument()
  })
  it('renders a customizable table header', () => {
    const { getAllByRole, getByText, getByTestId, rerender, queryByText } =
      renderFixture({
        //   rows: [],
        headerBackground: 'magenta',
      })

    expect(getAllByRole('row')).toHaveLength(ROWS.length + 1)
    const theadElement = document.querySelector('thead')
    expect(theadElement).toBeInTheDocument()
    expect(theadElement).toHaveStyle('background-color: magenta;')
    const tdElements = theadElement?.querySelectorAll('td')
    expect(tdElements).toHaveLength(COLUMNS.length)
    tdElements?.forEach((td, idx) => {
      if (COLUMNS[idx].header) {
        expect(getByText(COLUMNS[idx].header)).toBeInTheDocument()
      }
    })

    renderFixture(
      {
        disableTableHeader: true,
      },
      rerender as any
    )
    const theadElement1 = document.querySelector('thead')
    expect(theadElement1).toBeInTheDocument()
    expect(theadElement1).toHaveStyle('height: 0;')
    const trElement1 = theadElement1?.querySelector('tr')
    expect(trElement1).toHaveStyle('visibility: hidden;')
  })

  it('renders a loading state if loading is passed', () => {
    const { getByTestId, rerender, queryByTestId } = renderFixture({
      loading: true,
    })
    const tbodyElement = document.querySelector('tbody')
    const trElements = tbodyElement?.querySelectorAll('tr')
    const allTdElements = tbodyElement?.querySelectorAll('td')

    expect(trElements).toHaveLength(10)
    expect(allTdElements).toHaveLength(10 * COLUMNS.length)
  })
  it('renders select all checkbox triggering the corresponding callbacks', async () => {
    const { rerender, handleSelectAll } = renderFixture({})

    const theadElement = document.querySelector('thead')
    expect(theadElement).toBeInTheDocument()
    const firstTdElement = theadElement?.querySelector('td')
    expect(firstTdElement).toBeInTheDocument()
    const eventContainer = firstTdElement?.firstChild
    expect(eventContainer).toBeInTheDocument()
    expect(eventContainer).toHaveStyle('cursor: pointer;')
    await act(async () => {
      await fireEvent.click(eventContainer as HTMLElement, { button: 0 })
    })
    expect(handleSelectAll).toHaveBeenCalled()
    const { handleClearFilters } = renderFixture(
      { selectedRows: [1] },
      rerender as any
    )
    const theadElement1 = document.querySelector('thead')
    const firstTdElement1 = theadElement1?.querySelector('td')
    const eventContainer1 = firstTdElement1?.firstChild
    await act(async () => {
      await fireEvent.click(eventContainer1 as HTMLElement, { button: 0 })
    })
    expect(handleClearFilters).toHaveBeenCalledTimes(1)
  })

  it('it will call the setAllFilter/onSetAllFilters CB when sorting button for col is clicked', async () => {
    const { rerender, handleSetAllFilters, handleOnSetAllFilters } =
      renderFixture({
        columns: COLUMNS.map((col) => ({ ...col, filterKey: 'filter' })),
      })
    const theadElement = document.querySelector('thead')
    const trElement = theadElement?.querySelector('tr')
    const filterButtons = trElement?.querySelectorAll('button')
    // -1 for the row select column
    expect(filterButtons).toHaveLength(COLUMNS.length - 1)
    const button1 = filterButtons?.[0]
    await act(async () => {
      fireEvent.click(button1)
    })
    expect(handleSetAllFilters).toHaveBeenCalledTimes(1)
    const handleSetAllFiltersArgs = handleSetAllFilters.mock.calls[0][0]
    const setAllFiltersArgs = handleSetAllFiltersArgs([])
    expect(setAllFiltersArgs).toEqual([
      { filterKey: 'sorting', value: 'id,asc' },
    ])
    expect(handleOnSetAllFilters).toHaveBeenCalledTimes(1)
    expect(handleOnSetAllFilters).toHaveBeenCalledWith([
      { filterKey: 'sorting', value: 'id,asc' },
    ])

    const {
      handleSetAllFilters: setAll2,
      handleOnSetAllFilters: onSetAll2,
      rerender: re2,
    } = renderFixture(
      { allFilters: [{ filterKey: 'sorting', value: 'id,asc' }] },
      rerender as any
    )
    const theadElement2 = document.querySelector('thead')
    const trElement2 = theadElement2?.querySelector('tr')
    const filterButtons2 = trElement2?.querySelectorAll('button')
    const button2 = filterButtons2?.[0]
    await act(async () => {
      fireEvent.click(button2)
    })
    expect(setAll2).toHaveBeenCalledTimes(1)
    expect(setAll2).toHaveBeenCalledWith([
      { filterKey: 'sorting', value: 'id,desc' },
    ])
    expect(onSetAll2).toHaveBeenCalledTimes(1)
    expect(onSetAll2).toHaveBeenCalledWith([
      { filterKey: 'sorting', value: 'id,desc' },
    ])

    const { handleSetAllFilters: setAll3, handleOnSetAllFilters: onSetAll3 } =
      renderFixture(
        { allFilters: [{ filterKey: 'sorting', value: 'id,desc' }] },
        rerender as any
      )
    const theadElement3 = document.querySelector('thead')
    const trElement3 = theadElement3?.querySelector('tr')
    const filterButtons3 = trElement3?.querySelectorAll('button')
    const button3 = filterButtons3?.[0]
    await act(async () => {
      fireEvent.click(button3)
    })
    expect(setAll3).toHaveBeenCalledTimes(1)
    expect(setAll3).toHaveBeenCalledWith([])
    expect(onSetAll3).toHaveBeenCalledTimes(1)
    expect(onSetAll3).toHaveBeenCalledWith([])
  })

  // Continue with tests for other properties...
})
