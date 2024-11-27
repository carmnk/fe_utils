import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { CTextField } from '../TextField'

describe('CTextField', () => {
  it('renders with correct value', () => {
    const { getByDisplayValue } = render(<CTextField value="Test Value" />)
    expect(getByDisplayValue('Test Value')).toBeInTheDocument()
  })

  it('renders with correct label', () => {
    const { getByText } = render(<CTextField label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })
  it('doesnt render a label if disableLabel', () => {
    const { queryByText } = render(
      <CTextField label="Text Label" disableLabel />
    )
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })

  it('renders with correct helperText', () => {
    const { getByText } = render(<CTextField helperText="Helper Text" />)
    expect(getByText('Helper Text')).toBeInTheDocument()
  })

  it('doesnt render a helperText if disableHelperText', () => {
    const { queryByText } = render(
      <CTextField helperText="Helper Text" disableHelperText />
    )
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })

  it('calls onChange when value is changed', async () => {
    const handleChange = jest.fn()
    const { getByLabelText } = render(
      <CTextField label="Test Label" onChange={handleChange} />
    )
    await act(async () => {
      const input = document.querySelector('input')
      if (!input) throw new Error('Input not found')
      await fireEvent.change(input, {
        target: { value: 'New Value' },
      })
    })
    expect(handleChange).toHaveBeenCalled()
  })
  it('calls onChangeCompleted when value is changed and element is blurred', async () => {
    const handleChange = jest.fn()
    const handleChangeCompleted = jest.fn()
    const { getByLabelText, rerender } = render(
      <CTextField
        label="Test Label"
        onChange={handleChange}
        onChangeCompleted={handleChangeCompleted}
        value="start"
      />
    )
    const input = document.querySelector('input')
    if (!input) throw new Error('Input not found')

    await act(async () => {
      await fireEvent.focus(input, {})
    })
    await act(async () => {
      await fireEvent.change(input, {
        target: { value: 'New Value' },
      })
    })
    rerender(
      <CTextField
        label="Test Label"
        onChange={handleChange}
        onChangeCompleted={handleChangeCompleted}
        value="New Value"
      />
    )
    await act(async () => {
      await fireEvent.blur(input, {})
    })
    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChangeCompleted).toHaveBeenCalled()
  })

  it('renders with correct name', () => {
    const { getByTestId } = render(
      <CTextField name="test-name" data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input!.name).toBe('test-name')
  })

  it('renders with correct placeholder', () => {
    const { getByPlaceholderText } = render(
      <CTextField placeholder="Test Placeholder" />
    )
    expect(getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
  })

  it('renders as required when required is true', () => {
    const { getByTestId } = render(
      <CTextField required={true} data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input).toBeRequired()
    const strong = document.querySelector('strong')
    expect(strong).toHaveTextContent('*')
    expect(strong).toHaveStyle('color: rgb(211, 47, 47);')
  })

  it('renders with error when error is true', () => {
    // This test assumes that you're using Material-UI's CTextField and that it adds the 'Mui-error' class when error is true.
    const { getByText } = render(
      <CTextField error data-testid="textfield" label="Test Label" />
    )
    const input = document.querySelector('input')
    const label = getByText('Test Label')
    expect(label).toHaveStyle('color: rgb(211, 47, 47);')
    expect(getByText('This field is required')).toBeInTheDocument()
  })

  it('renders with correct maxLength', () => {
    const { getByTestId } = render(
      <CTextField maxLength={10} data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input.maxLength).toBe(10)
  })
  it('renders as disabled when disabled', () => {
    const { getByTestId } = render(
      <CTextField disabled={true} data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input).toBeDisabled()
  })

  it('renders as disabled when disabled is true', () => {
    const { getByTestId } = render(
      <CTextField disabled={true} data-testid="textfield" />
    )
    const input = document.querySelector('input')
    expect(input).toBeDisabled()
  })

  it('renders with correct icon', () => {
    const Icon = () => <span>Icon</span>
    const { getByText } = render(<CTextField endIcon={<Icon />} />)
    expect(getByText('Icon')).toBeInTheDocument()
  })

  it('renders with correct startIcon', () => {
    const StartIcon = () => <span>StartIcon</span>
    const { getByText } = render(<CTextField startIcon={<StartIcon />} />)
    expect(getByText('StartIcon')).toBeInTheDocument()
  })
  it('renders with an injected component when injectComponent is set', () => {
    const Icon = () => <span>Icon</span>
    const { getByText } = render(<CTextField injectComponent={<Icon />} />)
    expect(getByText('Icon')).toBeInTheDocument()
  })
})
