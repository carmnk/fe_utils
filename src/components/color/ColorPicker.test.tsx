import {
  render,
  fireEvent,
  act,
  findByRole,
  findByTestId,
  queryByTestId,
} from '@testing-library/react'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker', () => {
  it('renders with initial value', () => {
    const { getByTestId } = render(
      <ColorPicker value="#ff0000" data-testid="color-picker" />
    )
    const colorPickerElement = getByTestId('color-picker')
    const colorElement = colorPickerElement.querySelector('div')
    expect(colorElement).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    })
  })

  it('renders with correct selector size and color', () => {
    const { getByTestId } = render(
      <ColorPicker
        selectorSize={50}
        data-testid="color-picker"
        value="#ff0000"
      />
    )
    // Assuming the selector size is applied as a style, adjust as needed
    const colorPickerElement = getByTestId('color-picker')
    const colorElement = colorPickerElement.querySelector('div')
    expect(colorPickerElement).toHaveStyle({
      width: '50px',
      height: '50px',
    })
    expect(colorElement).toHaveStyle({
      backgroundColor: 'rgb(255, 0, 0)',
    })
  })

  it('calls onChange with new value when value is changed', async () => {
    const handleChange = jest.fn()
    const { getByTestId, findByTestId } = render(
      <ColorPicker
        value="#000000"
        onChange={handleChange}
        data-testid="color-picker"
      />
    )
    const colorPickerElement = getByTestId('color-picker')
    await act(async () => {
      await fireEvent(
        colorPickerElement,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      )
    })
    const popoverElement = await findByTestId('sentinelStart')
    expect(popoverElement).toBeInTheDocument()
    const allInputs = document.querySelectorAll('input')
    await act(async () => {
      await fireEvent.change(allInputs[0], {
        target: { value: '00ff00' },
      })
      await fireEvent.click(popoverElement, {})
    })
    // const popoverElement999 = await findByTestId('sentinelStartöl')
    const allButtons = document.querySelectorAll('button')
    const lastButton = allButtons[allButtons.length - 1]
    await act(async () => {
      await fireEvent(
        lastButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      )
    })
    expect(handleChange).toHaveBeenCalledWith('rgba(0, 255, 0, 1)')
  })

  it('is disabled/will not open when disabled is true', async () => {
    const handleChange = jest.fn()
    const { getByTestId, queryByTestId } = render(
      <ColorPicker
        value="#000000"
        onChange={handleChange}
        data-testid="color-picker"
        disabled
      />
    )
    const colorPickerElement = getByTestId('color-picker')
    await act(async () => {
      await fireEvent(
        colorPickerElement,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      )
    })
    const wait = await new Promise((res) =>
      setTimeout(() => {
        res(true)
      }, 2000)
    )
    expect(queryByTestId('sentinelStart')).not.toBeInTheDocument()
  })
})
