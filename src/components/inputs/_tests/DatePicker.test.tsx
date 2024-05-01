import { render, fireEvent } from '@testing-library/react'
import { DatePicker } from '../DatePicker'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import moment from 'moment'

describe('DatePicker', () => {
  it('renders with correct value', () => {
    const testDate = moment(new Date(2022, 1, 1))
    const { getByRole } = render(<DatePicker value={testDate} />)
    const datePicker = getByRole('textbox')
    expect(datePicker.value).toBe('01/02/2022')
  })

  it('calls onChange when value is changed', () => {
    const handleChange = jest.fn()
    const { getByRole } = render(<DatePicker onChange={handleChange} />)
    const datePicker = getByRole('textbox')
    fireEvent.change(datePicker, { target: { value: '02/02/2022' } })
    expect(handleChange).toHaveBeenCalled()
    const mock = handleChange.mock
    const calls = mock.calls
    const valuePart = calls[0][0] // first param of onChange, 2nd is event
    expect(valuePart.toISOString()).toEqual('2022-02-01T23:00:00.000Z')
  })

  it('renders with correct label', () => {
    const { getByText } = render(<DatePicker label="Test Label" />)
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  // Continue with tests for other properties...
})
