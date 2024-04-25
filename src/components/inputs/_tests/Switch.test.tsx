import { render, fireEvent } from '@testing-library/react'
import { Switch } from '../Switch'

describe('Switch', () => {
  it('renders with correct value', () => {
    const { getByRole } = render(<Switch value={true} />)
    const switchElement = getByRole('checkbox')
    expect(switchElement.checked).toBe(true)
  })

  it('calls onChange when value is changed', () => {
    const handleChange = jest.fn()
    const { getByRole } = render(<Switch onChange={handleChange} />)
    const switchElement = getByRole('checkbox')
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with correct label', () => {
    const { getByText } = render(<Switch label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  // Continue with tests for other properties...
})
