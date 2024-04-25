import { render } from '@testing-library/react'
import { Grid } from '../Grid'

describe('Grid', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Grid data-testid="grid">Test</Grid>)
    expect(getByTestId('grid')).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    const { getByText } = render(<Grid>Test</Grid>)
    expect(getByText('Test')).toBeInTheDocument()
  })

  // Add more tests as needed
})
