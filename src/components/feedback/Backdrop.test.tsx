import { render, screen } from '@testing-library/react'
import { Backdrop } from './Backdrop'

const label = 'Loading...'

describe('Backdrop', () => {
  test('should be rendered if open', () => {
    render(<Backdrop open={true} label={label} />)
    expect(screen.queryByText(label)).toBeInTheDocument()
  })
  test('should not be rendered if not open', () => {
    render(<Backdrop open={false} label={label} />)
    expect(screen.queryByText(label)).not.toBeInTheDocument()
  })

  it('should not display the label when not provided', () => {
    render(<Backdrop open={true} />)
    expect(screen.queryByText(label)).not.toBeInTheDocument()
  })
})
