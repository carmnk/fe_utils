import { render, fireEvent, act } from '@testing-library/react'
import { NoResults } from '../subComponents/NoResults'

describe('NoResults', () => {
  it('renders correctly', () => {
    const { getByText } = render(<NoResults />)
    expect(getByText('No results found')).toBeInTheDocument()
  })
  it('renders with custom label', () => {
    const { getByText } = render(<NoResults label="custom label" />)
    expect(getByText('custom label')).toBeInTheDocument()
  })
  it('renders a button to trigger a clearFilter callback', async () => {
    const clearFilters = jest.fn()
    const { getByText } = render(
      <NoResults clearFilters={clearFilters} disableClearFilters={false} />
    )
    const removeButtonElement = getByText('remove all filters')
    expect(removeButtonElement).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(removeButtonElement, { button: 0 })
    })
    expect(clearFilters).toHaveBeenCalled()
  })
  it('doesnt render a button to trigger a clearFilter callback if disableClearFilters', async () => {
    const clearFilters = jest.fn()
    const { queryByText } = render(
      <NoResults clearFilters={clearFilters} disableClearFilters />
    )
    const removeButtonElement = queryByText('remove all filters')
    expect(removeButtonElement).not.toBeInTheDocument()
  })
  it('renders a button to trigger a clearFilter callback and a custom label if passed ', async () => {
    const clearFilters = jest.fn()
    const { getByText } = render(
      <NoResults clearFilters={clearFilters} clearFilersLabel="clear all" />
    )
    const removeButtonElement = getByText('clear all')
    expect(removeButtonElement).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(removeButtonElement, { button: 0 })
    })

    expect(clearFilters).toHaveBeenCalled()
  })
})
