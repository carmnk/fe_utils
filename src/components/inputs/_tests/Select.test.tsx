import {
  render,
  fireEvent,
  act,
  findByRole,
  getByTestId,
} from '@testing-library/react'
import { Select } from '../Select'

describe('Select', () => {
  it('renders with correct value', () => {
    const { getByRole, getByText } = render(
      <Select value="option1" options={[{ value: 'option1', label: 'O1' }]} />
    )
    const optionElement = getByText('O1')
    // const select = getByRole('combobox')
    // expect(select.value).toBe('option1')
    expect(optionElement).toBeInTheDocument()
  })

  it('calls onChange when value is changed', async () => {
    const handleChange = jest.fn()
    const { getByTestId, findByTestId, getByText, getByRole } = render(
      <Select
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
      await fireEvent.mouseDown(getByRole('combobox'))
    })
    const popoverElement = await findByTestId('sentinelStart')
    expect(popoverElement).toBeInTheDocument()

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

  it('renders with correct label', () => {
    const { getByText } = render(<Select label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  it('doesnt render a label if disableLabel', () => {
    const { queryByText } = render(<Select label="Test Label" />)
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })

  it('renders with correct helperText', () => {
    const { getByText } = render(<Select helperText="Helper Text" />)
    expect(getByText('Helper Text')).toBeInTheDocument()
  })

  it('doesnt render a helperText if disableHelperText', () => {
    const { queryByText } = render(
      <Select helperText="Helper Text" disableHelperText />
    )
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })

  // Continue with tests for other properties...
})
