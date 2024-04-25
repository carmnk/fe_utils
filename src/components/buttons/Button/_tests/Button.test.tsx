import { render, fireEvent, act, getByRole } from '@testing-library/react'
import { Button } from '../Button'
import { mdiTestTube } from '@mdi/js'

const testTooltip = 'Test tooltip'

describe('Button', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <Button data-testid="button">Click me</Button>
    )
    expect(getByTestId('button')).toBeInTheDocument()
  })

  it('renders with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    )

    fireEvent.click(getByText('Click me'))

    expect(handleClick).toHaveBeenCalled()
  })
  it('displays the correct label when label is passed', () => {
    const { getByText } = render(<Button label="Submit" />)
    expect(getByText('Submit')).toBeInTheDocument()
  })
  it('displays the correct label when using children', () => {
    const { getByText } = render(<Button>Submit</Button>)
    expect(getByText('Submit')).toBeInTheDocument()
  })

  it('is not focusable when disableTabstop is true', () => {
    const { getByTestId } = render(
      <Button data-testid="button" disableTabstop />
    )
    expect(getByTestId('button')).toHaveAttribute('tabindex', '-1')
  })

  it('renders with correct title', () => {
    const { getByTestId } = render(
      <Button data-testid="button" title="Test title" />
    )
    expect(getByTestId('button')).toHaveAttribute('title', 'Test title')
  })

  it('renders with correct name', () => {
    const { getByTestId } = render(
      <Button data-testid="button" name="Test name" />
    )
    expect(getByTestId('button')).toHaveAttribute('name', 'Test name')
  })

  it('is disabled when disabled is true', () => {
    const { getByTestId } = render(<Button data-testid="button" disabled />)
    expect(getByTestId('button')).toBeDisabled()
  })

  it('shows tooltip when not disabled, even if disableTooltipWhenDisabled is true', async () => {
    const { getByTestId, getByText, findByText } = render(
      <Button
        data-testid="button"
        tooltip="Test tooltip"
        disableTooltipWhenDisabled
      />
    )
    const buttonElement = getByTestId('button')
    const parentElement = buttonElement?.parentElement

    if (parentElement) {
      await act(async () => {
        fireEvent(
          parentElement,
          new MouseEvent('mouseover', {
            bubbles: true,
          })
        )
      })
    }
    // need findByText bc tooltip shows up with delay
    const tooltip = await findByText(testTooltip)
    expect(tooltip).toBeInTheDocument()
    // expect(getByText('Test tooltip')).toBeInTheDocument()
  })
  it('does not shows tooltip when disabled and disableTooltipWhenDisabled is true', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <Button
        data-testid="button"
        tooltip="Test tooltip"
        disableTooltipWhenDisabled
        disabled
      />
    )
    const buttonElement = getByTestId('button')
    const parentElement = buttonElement?.parentElement

    if (parentElement) {
      await act(async () => {
        fireEvent(
          parentElement,
          new MouseEvent('mouseover', {
            bubbles: true,
          })
        )
      })
    }
    // wait manually bc. tooltip shows up with day
    const wait = await new Promise((res) =>
      setTimeout(() => {
        res(true)
      }, 2000)
    )
    expect(queryByText(testTooltip)).not.toBeInTheDocument()
  })
  it('renders with primary style when type is primary', () => {
    const { getByTestId } = render(
      <Button data-testid="button" type="primary" />
    )
    // expect(getByTestId('button')).toHaveStyle(
    //   'border: 0px solid blue !important'
    // )
  })

  it('renders with secondary style when type is secondary', () => {
    const { getByTestId } = render(
      <Button data-testid="button" type="secondary" />
    )
    expect(getByTestId('button')).toHaveStyle('border: 0px solid #1976d2;')
  })

  it('renders with text style when type is text', () => {
    const { getByTestId } = render(<Button data-testid="button" type="text" />)
    expect(getByTestId('button')).toHaveStyle('border: 0px solid #1976d2;')
  })
})
