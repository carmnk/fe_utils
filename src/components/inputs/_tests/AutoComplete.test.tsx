import {
  render,
  fireEvent,
  act,
  findByRole,
  getByTestId,
  getByDisplayValue,
} from '@testing-library/react'
import { CAutoComplete } from '../AutoComplete'

describe('Select', () => {
  it('renders with correct value', () => {
    const { getByDisplayValue, getByText } = render(
      <CAutoComplete
        value="option1"
        options={[{ value: 'option1', label: 'O1' }]}
      />
    )
    const optionElement = getByDisplayValue('O1')
    // const select = getByRole('combobox')
    // expect(select.value).toBe('option1')
    expect(optionElement).toBeInTheDocument()
  })

  it('calls onChange when value is changed via mouse/touch', async () => {
    const handleChange = jest.fn()
    const { getByTestId, findByTestId, getByText, findByRole } = render(
      <CAutoComplete
        value="option1"
        onChange={handleChange}
        options={[
          { value: 'option1', label: 'O1' },
          { value: 'option2', label: 'O2' },
        ]}
        data-testid="select"
      />
    )
    const inputElement = document.querySelector('input')
    const select = getByTestId('select')
    await act(async () => {
      // await fireEvent.mouseDown(getByRole('combobox'))
      await fireEvent.mouseDown(inputElement as any)
      // await fireEvent.mouseDown(select)
    })
    const popoverElementRoot = await findByRole('presentation')
    expect(popoverElementRoot).toBeInTheDocument()

    const optionElement = getByText('O2')
    await act(async () => {
      await fireEvent.click(optionElement)
    })
    // await act(async () => {
    //   fireEvent.click(optionElement, { target: { value: 'option2' } })
    // })
    const mock = handleChange.mock
    const calls = mock.calls
    const valuePart = calls[0][0] // first param of onChange, 2nd is event

    expect(handleChange).toHaveBeenCalled()
    expect(valuePart).toBe('option2')
  })

  it('calls onChange when value is changed via keyboard', async () => {
    const handleChange = jest.fn()
    const handleInputChange = jest.fn()
    const { getByTestId, getByDisplayValue, getByText, findByRole } = render(
      <CAutoComplete
        value="option1"
        onInputChange={handleInputChange}
        onChange={handleChange}
        options={[
          { value: 'option1', label: 'O1' },
          { value: 'option2', label: 'O2' },
        ]}
        data-testid="select"
      />
    )
    const inputElement = document.querySelector('input')
    const select = getByTestId('select')
    await act(async () => {
      // await fireEvent.mouseDown(getByRole('combobox'))
      await fireEvent.change(inputElement as any, { target: { value: 'option2' } })
      // await fireEvent.mouseDown(select)
    })
    const optionElement = getByText('O2')
    expect(handleInputChange).toHaveBeenCalled()
    await act(async () => {
      await fireEvent.keyUp(inputElement as any, { key: 'Enter', code: 'Enter' })
    })

    expect(handleChange).toHaveBeenCalled()
    const mock = handleChange.mock
    const calls = mock.calls
    const valuePart = calls[0][0] // first param of onChange, 2nd is event
    expect(valuePart).toBe('option2')

    await act(async () => {
      // await fireEvent.mouseDown(getByRole('combobox'))
      await fireEvent.change(inputElement as any, { target: { value: 'option1' } })
      // await fireEvent.mouseDown(select)
    })
    const optionElement2 = getByDisplayValue('option1')
    expect(handleInputChange).toHaveBeenCalledTimes(2)
    await act(async () => {
      await fireEvent.blur(inputElement as any, { key: 'Enter', code: 'Enter' })
    })
    expect(handleChange).toHaveBeenCalledTimes(2)
  })

  it('renders with correct label', () => {
    const { getByText } = render(
      <CAutoComplete
        label="Test Label"
        options={[
          { value: 'option1', label: 'O1' },
          { value: 'option2', label: 'O2' },
        ]}
        value="option1"
      />
    )
    expect(getByText('Test Label')).toBeInTheDocument()
  })
  it('doesnt render a label if disableLabel', () => {
    const { queryByText } = render(
      <CAutoComplete
        label="Test Label"
        options={[
          { value: 'option1', label: 'O1' },
          { value: 'option2', label: 'O2' },
        ]}
        value="option1"
        disableLabel
      />
    )
    expect(queryByText('Test Label')).not.toBeInTheDocument()
  })

  it('renders with correct helperText', () => {
    const { getByText } = render(
      <CAutoComplete
        helperText="Helper Text"
        options={[
          { value: 'option1', label: 'O1' },
          { value: 'option2', label: 'O2' },
        ]}
        value="option1"
      />
    )
    expect(getByText('Helper Text')).toBeInTheDocument()
  })

  it('doesnt render a helperText if disableHelperText', () => {
    const { queryByText } = render(
      <CAutoComplete
        helperText="Helper Text"
        options={[
          { value: 'option1', label: 'O1' },
          { value: 'option2', label: 'O2' },
        ]}
        value="option1"
        disableHelperText
      />
    )
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })

  // Continue with tests for other properties...
})
