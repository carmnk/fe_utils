import { render, fireEvent } from '@testing-library/react'
import { ListNavigation } from './CListNavigation'

describe('ListNavigation', () => {
  it('renders with correct initial value', () => {
    const { getByText } = render(
      <ListNavigation
        value="item1"
        onChange={() => {}}
        items={[
          { value: 'item1', label: 'Item 1' },
          { value: 'item2', label: 'Item 2' },
        ]}
      />
    )

    const item1Element = getByText('Item 1').parentElement?.parentElement
    const styles1 = item1Element?.style
    expect(item1Element).toHaveStyle('background-color: transparent;')
    console.log(getByText('Item 2').parentElement?.parentElement)
    const item2Element = getByText('Item 2').parentElement?.parentElement
    const styles2 = item2Element?.style
    expect(item2Element).toHaveStyle('background: transparent;')
  })

  it('calls onChange when item is clicked', () => {
    const handleChange = jest.fn()
    const { getByText } = render(
      <ListNavigation
        value="item1"
        onChange={handleChange}
        items={[
          { value: 'item1', label: 'Item 1' },
          { value: 'item2', label: 'Item 2' },
        ]}
      />
    )
    fireEvent.click(getByText('Item 2'))
    expect(handleChange).toHaveBeenCalledWith('item2')
  })

  // Continue with tests for other properties...
})
