import { render, fireEvent, queryByRole } from '@testing-library/react'
import { GenericInputField } from '../GenericInputField'
import moment from 'moment'

describe('GenericInputField', () => {
  it('renders with correct initial value', () => {
    const initialValue = 'initial value'
    const initialValueNumber = '12'
    const { getByRole, rerender } = render(
      <GenericInputField type="text" value={initialValue} onChange={() => {}} />
    )
    expect(getByRole('textbox')).toHaveValue(initialValue)
    rerender(
      <GenericInputField
        type="number"
        value={initialValueNumber}
        onChange={() => {}}
      />
    )
    expect(getByRole('textbox')).toHaveValue(initialValueNumber)
    rerender(
      <GenericInputField
        type="int"
        value={initialValueNumber}
        onChange={() => {}}
      />
    )
    expect(getByRole('textbox')).toHaveValue(initialValueNumber)
    rerender(
      <GenericInputField
        type="textarea"
        value={initialValue}
        onChange={() => {}}
      />
    )
    expect(getByRole('textbox')).toHaveValue(initialValue)
    rerender(
      <GenericInputField
        type="autocomplete"
        options={[{ value: 'test', label: 'TEST' }]}
        freeSolo
        value={initialValue}
        onChange={() => {}}
      />
    )
    expect(getByRole('combobox')).toHaveValue(initialValue)
    rerender(
      <GenericInputField
        type="select"
        options={[{ value: 'test', label: 'TEST' }]}
        value={'test'}
        onChange={() => {}}
      />
    )
    const input = document.querySelector('input')
    expect(input).toHaveValue('test')

    rerender(
      <GenericInputField
        type="multiselect"
        options={[{ value: 'test', label: 'TEST' }]}
        value={['test']}
        onChange={() => {}}
      />
    )
    expect(input).toHaveValue('test')
    // Datefield
    rerender(
      <GenericInputField
        type="date"
        value={moment('2024-01-02')}
        onChange={() => {}}
      />
    )
    const dateInputElement = document.querySelector('input')
    expect(dateInputElement).toHaveValue('01/02/2024')
    // Checkbox
    rerender(<GenericInputField type="bool" value={true} onChange={() => {}} />)
    const checkboxElement = document.querySelector('input')
    expect(checkboxElement).toBeChecked()
  })
  it('doesnt render when hidden is set', () => {
    const { queryByRole, rerender } = render(
      <GenericInputField
        type="text"
        value={'initialValue'}
        onChange={() => {}}
        hidden
      />
    )
    expect(queryByRole('textbox')).not.toBeInTheDocument()
  })
  it('calls onChange when value is changed', () => {
    const handleChange = jest.fn()
    // Text
    const { getByRole, rerender } = render(
      <GenericInputField
        type="text"
        value="initial value"
        onChange={handleChange}
        name="test-name"
      />
    )
    fireEvent.change(getByRole('textbox'), { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledWith(
      'new value',
      expect.anything(),
      'test-name'
    )
    // TextArea
    rerender(
      <GenericInputField
        type="textarea"
        value="initial value"
        onChange={handleChange}
        name="test-name"
      />
    )
    fireEvent.change(getByRole('textbox'), { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledWith(
      'new value',
      expect.anything(),
      'test-name'
    )
  })
})
