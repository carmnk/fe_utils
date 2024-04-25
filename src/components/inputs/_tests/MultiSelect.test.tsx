import { render, fireEvent, act } from '@testing-library/react'
import { MultiSelect } from '../MultiSelect'

describe('MultiSelect', () => {
  it('renders with correct initial values', () => {
    const { getByText, getByRole } = render(
      <MultiSelect
        value={['option1', 'option2']}
        options={[
          { value: 'option1', label: 'O1', textLabel: 'Option 1' },
          { value: 'option2', label: 'O2', textLabel: 'Option 2' },
        ]}
      />
    )
    const select = getByRole('combobox')
    const optionElements = getByText('Option 1, Option 2')
  })

  it('calls onChange when values are changed', async () => {
    const handleChange = jest.fn()
    const { getByRole, findByTestId, getByText } = render(
      <MultiSelect
        onChange={handleChange}
        value={['option1']}
        options={[
          { value: 'option1', label: 'O1', textLabel: 'Option 1' },
          { value: 'option2', label: 'O2', textLabel: 'Option 2' },
        ]}
      />
    )
    const select = getByRole('combobox')

    await act(async () => {
      await fireEvent.mouseDown(select)
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
    expect(valuePart).toEqual(['option1', 'option2'])
  })

  it('renders with correct label', () => {
    const { getByText } = render(<MultiSelect label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with correct label', () => {
    const { getByText } = render(<MultiSelect label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  it('doesnt render a label if disableLabel', () => {
    const { queryByText } = render(
      <MultiSelect label="Test Label" disableLabel />
    )
    expect(queryByText('Test Label')).not.toBeInTheDocument()
  })

  it('renders with correct helperText', () => {
    const { getByText } = render(<MultiSelect helperText="Helper Text" />)
    expect(getByText('Helper Text')).toBeInTheDocument()
  })

  it('doesnt render a helperText if disableHelperText', () => {
    const { queryByText } = render(
      <MultiSelect helperText="Helper Text" disableHelperText />
    )
    expect(queryByText('Helper Text')).not.toBeInTheDocument()
  })
  // Continue with tests for other properties...
})
