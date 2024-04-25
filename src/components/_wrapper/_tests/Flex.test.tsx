import { render } from '@testing-library/react'
import { Flex } from '../Flex'

describe('Flex', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Flex data-testid="flex">Test</Flex>)
    expect(getByTestId('flex')).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    const { getByText } = render(<Flex>Test</Flex>)
    expect(getByText('Test')).toBeInTheDocument()
  })

  // Add more tests as needed
})
