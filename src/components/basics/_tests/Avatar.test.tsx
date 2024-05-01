import { render, fireEvent, act, getByText } from '@testing-library/react'
import { Avatar } from '../Avatar'

const testFullName = 'John Doe'
const testId = 'test-id'
const testTooltip = 'Test tooltip'

describe('Avatar', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Avatar data-testid={testId} />)
    expect(getByTestId(testId)).toBeInTheDocument()
  })

  it('renders with correct src', () => {
    const { getByTestId } = render(
      <Avatar data-testid={testId} src="test.jpg" />
    )

    const avatorRootElement = getByTestId(testId)
    const imgElement = avatorRootElement.querySelector('img')
    expect(imgElement).toHaveAttribute('src', 'test.jpg')
  })

  it('renders with correct size', () => {
    const { getByTestId } = render(<Avatar data-testid={testId} size={50} />)
    const avatar = getByTestId(testId)
    expect(avatar).toHaveStyle('width: 50px')
    expect(avatar).toHaveStyle('height: 50px')
  })

  it('displays the correct initials', () => {
    const { getByText } = render(<Avatar fullName={testFullName} />)
    expect(getByText('JD')).toBeInTheDocument()
  })
  it('does not display initials when disableInitials is true', () => {
    const { queryByText } = render(
      <Avatar fullName={testFullName} disableInitials />
    )
    expect(queryByText('JD')).toBeNull()
  })

  it('displays a tooltip on hover when customTooltip is provided', async () => {
    const { getByTestId, getByText, findByText } = render(
      <Avatar customTooltip={testTooltip} data-testid="avatar" />
    )
    const avt = getByTestId('avatar')
    await act(async () => {
      fireEvent(
        getByTestId('avatar'),
        new MouseEvent('mouseover', {
          bubbles: true,
        })
      )
    })
    console.log(avt)
    const tooltip = await findByText(testTooltip)
    expect(tooltip).toBeInTheDocument()
  })
  it('changes the background color when bgColor is provided', () => {
    const { getByTestId } = render(
      <Avatar bgColor="red" data-testid="avatar" />
    )
    expect(getByTestId('avatar')).toHaveStyle('background-color: red')
  })
  it('changes the the initials (fullName!) fontSize when fontSize is provided', () => {
    const { getByTestId, getByText } = render(
      <Avatar fontSize={32} fullName="John Doe" data-testid="avatar" />
    )
    const initialsElement = getByText('JD')
    const fs = initialsElement.style?.["font-size"]
    console.warn(initialsElement.style, initialsElement.style.fontSize, fs )
    expect(initialsElement).toHaveStyle('font-size: 32px;')
  })
})
