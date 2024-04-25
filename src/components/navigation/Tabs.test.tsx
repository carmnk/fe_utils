import { render, fireEvent } from '@testing-library/react'
import { Tabs } from './CTabs'

describe('Tabs', () => {
  it('renders with correct initial value', () => {
    const { getByText } = render(
      <Tabs
        value={'tab1'}
        onChange={() => {}}
        items={[
          { label: 'Tab 1', value: 'tab1' },
          { label: 'Tab 2', value: 'tab2' },
        ]}
      />
    )
    const tab1 = getByText('Tab 1')
    expect(tab1).toBeInTheDocument()
    const tab2 = getByText('Tab 2')
    expect(tab2).toBeInTheDocument()
  })

  it('calls onChange when tab is clicked', () => {
    const handleChange = jest.fn()
    const { getByText } = render(
      <Tabs
        value={'tab1'}
        onChange={handleChange}
        items={[
          { label: 'Tab 1', value: 'tab1' },
          { label: 'Tab 2', value: 'tab2' },
        ]}
      />
    )
    fireEvent.click(getByText('Tab 2'))
    expect(handleChange).toHaveBeenCalledWith('tab2')
  })
  it('renders with correct indicator color', () => {
    const { container, rerender } = render(
      <Tabs
        value="item1"
        onChange={() => {}}
        items={[{ value: 'item1', label: 'Item 1' }]}
        // indicatorColor="secondary"
      />
    )

    const defaultPrimaryColor = 'rgb(25, 118, 210)'
    const defaultSecondaryColor = 'rgb(156, 39, 176)'

    expect(container.querySelector('.MuiTabs-indicator')).toHaveStyle(
      `background-color: ${defaultPrimaryColor};`
    )
    rerender(
      <Tabs
        value="item1"
        onChange={() => {}}
        items={[{ value: 'item1', label: 'Item 1' }]}
        indicatorColor="secondary"
      />
    )
    expect(document.querySelector('.MuiTabs-indicator')).toHaveStyle(
      `background-color: ${defaultSecondaryColor};`
    )
  })

  it('renders with correct text color', () => {
    const { getByRole, rerender } = render(
      <Tabs
        value="item1"
        onChange={() => {}}
        items={[{ value: 'item1', label: 'Item 1' }]}
        textColor="secondary"
      />
    )
    expect(getByRole('tab')).toHaveClass('MuiTab-textColorSecondary')
    rerender(
      <Tabs
        value="item1"
        onChange={() => {}}
        items={[{ value: 'item1', label: 'Item 1' }]}
        // textColor="secondary"
      />
    )
    expect(getByRole('tab')).toHaveClass('MuiTab-textColorPrimary')
  })

  // Continue with tests for other properties...
})
