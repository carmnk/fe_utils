import { render, fireEvent } from '@testing-library/react'
import { StringArrayField } from '../StringArrayField'

describe('StringArrayField', () => {
  it('renders with correct initial value', () => {
    const { getByDisplayValue } = render(
      <StringArrayField value={['item1', 'item2']} onChange={() => {}} />
    )
    expect(getByDisplayValue('item1')).toBeInTheDocument()
    expect(getByDisplayValue('item2')).toBeInTheDocument()
  })
  it('doesnt render without value or value = empty array with empty string value', () => {
    const { getByDisplayValue } = render(
      <StringArrayField value={[]} onChange={() => {}} />
    )
    const input = document.querySelector('input')
    expect(input).toHaveValue('')
  })

  it('renders with correct labels', () => {
    const label = 'TEST_LABEL'
    const { queryAllByText } = render(
      <StringArrayField
        value={['item1', 'item2']}
        onChange={() => {}}
        label={label}
      />
    )
    const labels = queryAllByText(label)
    expect(queryAllByText(label).length).toBe(2)
    expect(labels[0].innerHTML.trim()).toBe(label)
  })
  it('renders as required if required is passed', () => {
    const label = 'TEST_LABEL'
    const { queryAllByText } = render(
      <StringArrayField
        value={['item1', 'item2']}
        onChange={() => {}}
        label={label}
        required
      />
    )
    const input = document.querySelector('input')
    expect(input).toBeRequired()
    const strong = document.querySelector('strong')
    expect(strong).toHaveTextContent('*')
    expect(strong).toHaveStyle('color: rgb(211, 47, 47);')
  })
  it('renders as disabled when disabled', () => {
    const { getByTestId } = render(
      <StringArrayField
        value={['item1', 'item2']}
        onChange={() => {}}
        disabled
      />
    )
    const input = document.querySelector('input')
    expect(input).toBeDisabled()
  })
  it('renders with error when error is true', () => {
    // This test assumes that you're using Material-UI's TextField and that it adds the 'Mui-error' class when error is true.
    const { queryAllByText } = render(
      <StringArrayField
        value={['item1', 'item2']}
        onChange={() => {}}
        label="Test Label"
        error
      />
    )
    const input = document.querySelector('input')
    const label = queryAllByText('Test Label')?.[0]
    expect(label).toHaveStyle('color: rgb(211, 47, 47);')
    expect(queryAllByText('This field is required').length).toBe(2)
  })

  it('calls onChange when value is changed', () => {
    const arrayFieldName = 'array_field'
    const handleChange = jest.fn()
    const { getByDisplayValue } = render(
      <StringArrayField
        value={['item1', 'item2']}
        name={arrayFieldName}
        onChangeArray={handleChange}
      />
    )

    const inputs = document.querySelectorAll('input')
    const firstInput = inputs[0]
    fireEvent.change(firstInput, {
      target: { value: 'new value' },
    })
    expect(handleChange).toHaveBeenCalledWith('new value', arrayFieldName)

    const secondInput = inputs[1]
    fireEvent.change(secondInput, {
      target: { value: 'new value 2' },
    })
    expect(handleChange).toHaveBeenCalledTimes(2)
    expect(handleChange).toHaveBeenLastCalledWith('new value 2', arrayFieldName)
  })
  it('removes an item when the button is clicked', () => {
    const arrayFieldName = 'array_field'
    const handleChange = jest.fn()
    const handleRemoveItem = jest.fn()
    const { getByTestId } = render(
      <StringArrayField
        value={['item1', 'item2']}
        name={arrayFieldName}
        onChangeArray={handleChange}
        onRemoveItem={handleRemoveItem}
        enableDeleteFirst
      />
    )
    const delItem1 = getByTestId('delete_1')
    fireEvent.click(delItem1, {})
    expect(handleRemoveItem).toHaveBeenLastCalledWith('array_field', 1)

    const delItem0 = getByTestId('delete_0')
    fireEvent.click(delItem0, {})
    expect(handleRemoveItem).toHaveBeenLastCalledWith('array_field', 0)
  })

  // Continue with tests for other properties...
})
