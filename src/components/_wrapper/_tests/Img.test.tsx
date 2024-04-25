import { render } from '@testing-library/react'
import { Img } from '../Img'

describe('Img', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Img data-testid="img" />)
    expect(getByTestId('img')).toBeInTheDocument()
  })

  it('renders with correct src', () => {
    const { getByTestId } = render(<Img data-testid="img" src="test.jpg" />)
    expect(getByTestId('img')).toHaveAttribute('src', 'test.jpg')
  })

  // Add more tests as needed
})
