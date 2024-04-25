import { render, fireEvent } from '@testing-library/react'
import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  it('renders with correct value', () => {
    const { getByRole } = render(<Checkbox value={true} />)
    const checkbox = getByRole('checkbox')
    expect(checkbox.checked).toBe(true)
  })

  it('calls onChange when value is changed', () => {
    const handleChange = jest.fn()
    const { getByRole } = render(<Checkbox onChange={handleChange} />)
    const checkbox = getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with correct label', () => {
    const { getByText } = render(<Checkbox label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with correct helperText', () => {
    const { getByText } = render(<Checkbox helperText="Helper Text" />)
    expect(getByText('Helper Text')).toBeInTheDocument()
  })

  // Continue with tests for other properties...
})
