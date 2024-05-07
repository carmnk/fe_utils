import { render, fireEvent } from '@testing-library/react'
import { BottomNavigation } from '../BottomNavigation'
import { mdiTestTube } from '@mdi/js'

describe('BottomNavigation', () => {
  it('renders with correct initial value', () => {
    const { getByText } = render(
      <BottomNavigation
        value="item1"
        onChange={() => {}}
        items={[
          { value: 'item1', label: 'Item 1', icon: mdiTestTube },
          { value: 'item2', label: 'Item 2', icon: mdiTestTube },
        ]}
      />
    )
    expect(getByText('Item 1')).toHaveClass('Mui-selected')
    expect(getByText('Item 2')).not.toHaveClass('Mui-selected')
    expect(document.querySelectorAll('svg').length).toBe(2)
  })
  it('renders with correct initial value', () => {
    const { getByText } = render(
      <BottomNavigation
        value="item1"
        onChange={() => {}}
        items={[
          { value: 'item1', label: 'Item 1', icon: 'icon1' },
          { value: 'item2', label: 'Item 2', icon: 'icon2' },
        ]}
        showLabels
      />
    )
    expect(getByText('Item 1')).toHaveClass('Mui-selected')
    expect(getByText('Item 2')).not.toHaveClass('Mui-selected')
  })

  it('calls onChange when item is clicked', () => {
    const handleChange = jest.fn()
    const { getByText } = render(
      <BottomNavigation
        value="item2"
        onChange={handleChange}
        items={[
          { value: 'item1', label: 'Item 1', icon: 'icon1' },
          { value: 'item2', label: 'Item 2', icon: 'icon2' },
        ]}
      />
    )
    fireEvent.click(getByText('Item 1'))
    expect(handleChange).toHaveBeenCalledWith('item1')
  })

  // Continue with tests for other properties...
})
