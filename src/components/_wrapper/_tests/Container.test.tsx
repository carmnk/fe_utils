import { render } from '@testing-library/react'
import { Container } from '../Container'

describe('Container', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <Container data-testid="container">Test</Container>
    )
    expect(getByTestId('container')).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    const { getByText } = render(<Container>Test</Container>)
    expect(getByText('Test')).toBeInTheDocument()
  })

  // Add more tests as needed
})
