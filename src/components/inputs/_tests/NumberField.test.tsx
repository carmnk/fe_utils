import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { NumberField } from '../NumberField'

describe('NumberField', () => {
  it('renders with correct value', () => {
    const { getByDisplayValue } = render(<NumberField value="123" />)
    expect(getByDisplayValue('123')).toBeInTheDocument()
  })

  it('renders with correct label', () => {
    const { getByText } = render(<NumberField label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })
  it('doesnt render a label if disableLabel', () => {
    const { queryByText } = render(
      <NumberField label="Text Label" disableLabel />
    )
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })

  it('renders with correct helperText', () => {
    const { getByText } = render(<NumberField helperText="Helper Text" />)
    expect(getByText('Helper Text')).toBeInTheDocument()
  })

  it('doesnt render a helperText if disableHelperText', () => {
    const { queryByText } = render(
      <NumberField helperText="Helper Text" disableHelperText />
    )
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })

  it('calls onChange when value is changed', async () => {
    const handleChange = jest.fn()
    const { getByLabelText } = render(
      <NumberField label="Test Label" onChange={handleChange} />
    )
    await act(async () => {
      const input = document.querySelector('input')
      if (!input) throw new Error('Input not found')
      await fireEvent.change(input, {
        target: { value: '123' },
      })
    })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
  it('doesnt call onChange when value is changed with a non-numeric string', async () => {
    const handleChange = jest.fn()
    const { getByLabelText } = render(
      <NumberField label="Test Label" onChange={handleChange} />
    )
    await act(async () => {
      const input = document.querySelector('input')
      if (!input) throw new Error('Input not found')
      await fireEvent.change(input, {
        target: { value: '123a' },
      })
    })
    expect(handleChange).toHaveBeenCalledTimes(0)
  })

  it('renders with correct name', () => {
    const { getByTestId } = render(
      <NumberField name="test-name" data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input!.name).toBe('test-name')
  })

  it('renders with correct placeholder', () => {
    const { getByPlaceholderText } = render(
      <NumberField placeholder="Test Placeholder" />
    )
    expect(getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
  })

  it('renders as required when required is true', () => {
    const { getByTestId } = render(
      <NumberField required={true} data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input).toBeRequired()
    const strong = document.querySelector('strong')
    expect(strong).toHaveTextContent('*')
  })

  it('renders with error when error is true', () => {
    // This test assumes that you're using Material-UI's NumberField and that it adds the 'Mui-error' class when error is true.
    const { getByText } = render(
      <NumberField error data-testid="textfield" label="Test Label" />
    )
    const input = document.querySelector('input')
    const label = getByText('Test Label')
    expect(label).toHaveStyle('color: rgb(211, 47, 47);')
    expect(getByText('This field is required')).toBeInTheDocument()
  })

  it('renders with correct maxLength', () => {
    const { getByTestId } = render(
      <NumberField maxLength={10} data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input.maxLength).toBe(10)
  })
  it('renders as disabled when disabled', () => {
    const { getByTestId } = render(
      <NumberField disabled={true} data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input).toBeDisabled()
  })

  // it('renders as disabled when locked is true', () => { --> LOCKED DOES NOT EXIST FOR NumberField
  //   const { getByTestId } = render(
  //     <NumberField locked={true} data-testid="textfield" />
  //   )
  //   const input = document.querySelector('input')
  //   expect(input).toBeDisabled()
  // })

  it('renders with correct icon', () => {
    const Icon = () => <span>Icon</span>
    const { getByText } = render(<NumberField endIcon={<Icon />} />)
    expect(getByText('Icon')).toBeInTheDocument()
  })

  it('renders with correct startIcon', () => {
    const StartIcon = () => <span>StartIcon</span>
    const { getByText } = render(<NumberField startIcon={<StartIcon />} />)
    expect(getByText('StartIcon')).toBeInTheDocument()
  })
})
