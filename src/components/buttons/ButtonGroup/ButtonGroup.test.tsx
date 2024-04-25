import { render, fireEvent } from '@testing-library/react'
import { ButtonGroup } from './ButtonGroup'
import { mdiTestTube } from '@mdi/js'

describe('ButtonGroup', () => {
  it('renders with correct initial value when using buttons', () => {
    const { getByText } = render(
      <ButtonGroup
        buttons={[
          { value: 'button1', label: 'Button 1' },
          { value: 'button2', label: 'Button 2' },
        ]}
        value="button1"
        onChange={() => {}}
      />
    )
    const typographyElement = getByText('Button 1')
    const buttonElement = typographyElement.parentElement
    const buttonElementClasses = buttonElement?.className.split(' ')
    expect(buttonElementClasses?.includes('MuiButton-containedPrimary')).toBe(
      true
    )
    const typographyElement2 = getByText('Button 2')
    const buttonElement2 = typographyElement2.parentElement
    const buttonElementClasses2 = buttonElement2?.className.split(' ')
    expect(buttonElementClasses2?.includes('MuiButton-textPrimary')).toBe(true)
  })
  it('renders as IconButtonGroup', () => {
    const { queryByText, getByText } = render(
      <ButtonGroup
        buttons={[
          { value: 'button1', label: 'Button 1', icon: mdiTestTube },
          { value: 'button2', label: 'Button 2', icon: mdiTestTube },
        ]}
        value="button1"
        onChange={() => {}}
        iconButtons
      />
    )
    const typographyElement1 = queryByText('Button 1')
    expect(typographyElement1).toBe(null)
    const typographyElement2 = queryByText('Button 1')
    expect(typographyElement2).toBe(null)
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBe(2)
  })

  it('renders with correct initial value when using items', () => {
    const { getByText } = render(
      <ButtonGroup
        items={[
          { value: 'button1', label: 'Button 1' },
          { value: 'button2', label: 'Button 2' },
        ]}
        value="button1"
        onChange={() => {}}
      />
    )
    const typographyElement = getByText('Button 1')
    const buttonElement = typographyElement.parentElement
    const buttonElementClasses = buttonElement?.className.split(' ')
    expect(buttonElementClasses?.includes('MuiButton-containedPrimary')).toBe(
      true
    )
    const typographyElement2 = getByText('Button 2')
    const buttonElement2 = typographyElement2.parentElement
    const buttonElementClasses2 = buttonElement2?.className.split(' ')
    expect(buttonElementClasses2?.includes('MuiButton-textPrimary')).toBe(true)
  })

  it('calls onChange when button is clicked', () => {
    const handleChange = jest.fn()
    const { getByText } = render(
      <ButtonGroup
        buttons={[
          { value: 'button1', label: 'Button 1' },
          { value: 'button2', label: 'Button 2' },
        ]}
        value="button1"
        onChange={handleChange}
      />
    )
    fireEvent.click(getByText('Button 2'))
    expect(handleChange).toHaveBeenCalledWith('button2')
  })

  it('offers isSelect() prop for customizing the selection Method', () => {
    const handleChange = jest.fn()
    const { getByText } = render(
      <ButtonGroup
        buttons={[
          { value: 'button1 action', label: 'Button 1' },
          { value: 'button2 action', label: 'Button 2' },
        ]}
        value="button1"
        isSelected={(value, groupValue) => value.includes(groupValue)}
        onChange={handleChange}
      />
    )
    const typographyElement = getByText('Button 1')
    const buttonElement = typographyElement.parentElement
    const buttonElementClasses = buttonElement?.className.split(' ')
    expect(buttonElementClasses?.includes('MuiButton-containedPrimary')).toBe(
      true
    )
  })
  it('offers transformValue() prop for customizing the onChange Value', () => {
    const handleChange = jest.fn()
    const { getByText } = render(
      <ButtonGroup
        buttons={[
          { value: 'button1 action', label: 'Button 1' },
          { value: 'button2 action', label: 'Button 2' },
        ]}
        value="button1"
        isSelected={(value, groupValue) => value.includes(groupValue)}
        onChange={handleChange}
        transformValue={(value, groupValue) =>
          value.includes(groupValue) ? groupValue : value
        }
      />
    )
    fireEvent.click(getByText('Button 1'))
    expect(handleChange).toHaveBeenCalledWith('button1')
  })

  // Continue with tests for other properties...
})
