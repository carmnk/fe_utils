import { render, fireEvent, act } from '@testing-library/react'
import { ClickTextField } from '../ClickTextField'
import { mdiPencil } from '@mdi/js'

describe('ClickTextFieldComponent', () => {
  it('renders with correct initial value', () => {
    const { getByText } = render(<ClickTextField value="Test Value" />)
    const typographyElement = getByText('Test Value')
    expect(typographyElement).toBeInTheDocument()
  })

  it('renders with placeholder if value is nullish/falsy', () => {
    const { getByText } = render(
      <ClickTextField placeholder="Test Placeholder" value="" />
    )
    const typographyElement = getByText('Test Placeholder')
    expect(typographyElement).toBeInTheDocument()
    expect(typographyElement).toHaveStyle('font-style: italic;')
    expect(typographyElement).toHaveStyle('font-weight: 400;')
  })
  it('renders with chip component instead of typography if useChip is passed', () => {
    const { getByText, rerender } = render(
      <ClickTextField
        placeholder="Test Placeholder"
        value="Test Value"
        useChip
      />
    )
    const typographyElement = getByText('Test Value')
    expect(typographyElement).toBeInTheDocument()
    expect(typographyElement).toHaveClass('MuiChip-label')
    rerender(<ClickTextField placeholder="Test Placeholder" value="" useChip />)
    const chipLabelElement = getByText('Test Placeholder')
    expect(chipLabelElement).toBeInTheDocument()
    expect(chipLabelElement).toHaveClass('MuiChip-label')
  })
  it('renders an additionalLabelComponent if passed', () => {
    const { getByText } = render(
      <ClickTextField
        placeholder="Test Placeholder"
        value="Test Value"
        additionalLabelComponent={<div>Additional Label</div>}
      />
    )
    const additionalLabelElement = getByText('Additional Label')
    expect(additionalLabelElement).toBeInTheDocument()
  })
  it('renders an Input Field when the edit button is clicked and closes when clicked again', async () => {
    const onClickAway = jest.fn()
    const { getByText, getByDisplayValue } = render(
      <ClickTextField
        placeholder="Test Placeholder"
        value="Test Value"
        onClickAway={onClickAway}
      />
    )
    const buttonElement = document.querySelector('button')
    expect(buttonElement).toBeInTheDocument()
    const pathElement = buttonElement.querySelector('path')
    expect(pathElement).toHaveAttribute('d', mdiPencil)
    await act(async () => {
      fireEvent.click(buttonElement)
    })
    const inputElement = document.querySelector('input')
    expect(inputElement).toBeInTheDocument()
    const inputFieldElement = getByDisplayValue('Test Value')
    expect(inputFieldElement).toBeInTheDocument()
    const buttonElement1 = document.querySelector('button')
    await act(async () => {
      fireEvent.click(buttonElement1)
    })
    expect(inputFieldElement).not.toBeInTheDocument()
    // expect(onClickAway).toHaveBeenCalledTimes(1)
  })

  it('calls onChange when the input field has been changed and enter is pressed', async () => {
    const onChange = jest.fn()
    const { getByText, getByDisplayValue } = render(
      <ClickTextField
        placeholder="Test Placeholder"
        value="Test Value"
        onChange={onChange}
      />
    )
    const buttonElement = document.querySelector('button')
    await act(async () => {
      fireEvent.click(buttonElement)
    })
    const inputElement = document.querySelector('input')
    expect(inputElement).toBeInTheDocument()
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'New Value' } })
    })
    expect(onChange).toHaveBeenCalledTimes(0)
    const inputFieldElement = getByDisplayValue('New Value')
    expect(inputFieldElement).toBeInTheDocument()
    await act(async () => {
      fireEvent.keyUp(inputElement, { key: 'Enter', type: 'keyup' })
    })
    expect(onChange).toHaveBeenCalledWith('New Value')
  })
  it('calls onChange when the input field has been changed and the button pressed', async () => {
    const onChange = jest.fn()
    const { getByText, getByDisplayValue } = render(
      <ClickTextField
        placeholder="Test Placeholder"
        value="Test Value"
        onChange={onChange}
      />
    )
    const buttonElement = document.querySelector('button')
    await act(async () => {
      fireEvent.click(buttonElement)
    })
    const inputElement = document.querySelector('input')
    expect(inputElement).toBeInTheDocument()
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'New Value' } })
    })
    expect(onChange).toHaveBeenCalledTimes(0)
    const inputFieldElement = getByDisplayValue('New Value')
    expect(inputFieldElement).toBeInTheDocument()
    const allButtonElements = document.querySelectorAll('button')
    const lastButtonElement = allButtonElements[allButtonElements.length - 1]
    await act(async () => {
      fireEvent.click(lastButtonElement, { key: 'Enter', type: 'keyup' })
    })
    expect(onChange).toHaveBeenCalledWith('New Value')
  })

  it('renders an autocomplete component if variant=autocomplete is passed', async () => {
    const { getByText, getByDisplayValue } = render(
      <ClickTextField
        placeholder="Test Placeholder"
        value="Test Value"
        variant="autocomplete"
      />
    )
    const buttonElement = document.querySelector('button')
    await act(async () => {
      fireEvent.click(buttonElement)
    })
    const inputElement = document.querySelector('input')
    expect(inputElement).toBeInTheDocument()
    const inputFieldElement = getByDisplayValue('Test Value')
    expect(inputFieldElement).toBeInTheDocument()
    expect(inputFieldElement).toHaveClass('MuiAutocomplete-input')
  })

  it('can validate the input field value', async () => {
    const onChange = jest.fn()
    const validateInput = (value: string) => value.length > 3
    const { getByText, getByDisplayValue } = render(
      <ClickTextField
        placeholder="Test Placeholder"
        value="Test Value"
        validateInput={validateInput}
        onChange={onChange}
      />
    )
    const buttonElement = document.querySelector('button')
    await act(async () => {
      fireEvent.click(buttonElement)
    })
    const inputElement = document.querySelector('input')
    expect(inputElement).toBeInTheDocument()
    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'New Input' } })
    })
    const inputFieldElement = getByDisplayValue('New Input')
    expect(inputFieldElement).toBeInTheDocument()

    await act(async () => {
      fireEvent.change(inputElement, { target: { value: 'New' } })
    })
    const inputFieldElement2 = getByDisplayValue('New Input')
    expect(inputFieldElement2).toBeInTheDocument()
  })

  // Continue with tests for other properties...
})
