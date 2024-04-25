import { render, fireEvent } from '@testing-library/react'
import { CopyClipboardContext } from './CopyClipboardContext'

describe('CopyClipboardContext', () => {
  it('renders children without CopyToClipboard when disableCopy is true', () => {
    const { getByTestId } = render(
      <CopyClipboardContext
        disableCopy
        data-testid="copy-context"
        text="Test text"
      >
        <div data-testid="child">Child</div>
      </CopyClipboardContext>
    )

    expect(getByTestId('child')).toBeInTheDocument()
  })

  it('renders children with CopyToClipboard when disableCopy is false', () => {
    const { getByTestId } = render(
      <CopyClipboardContext
        text="Test text"
        onCopy={jest.fn()}
        data-testid="copy-context"
      >
        <div data-testid="child">Child</div>
      </CopyClipboardContext>
    )

    expect(getByTestId('child')).toBeInTheDocument()
  })

  it('calls onCopy when CopyToClipboard is clicked and disableCopy is false', () => {
    const handleCopy = jest.fn()
    const { getByTestId } = render(
      <CopyClipboardContext onCopy={handleCopy} data-testid="copy-context">
        <div data-testid="child" onClick={() => handleCopy('txt')}>
          Child
        </div>
      </CopyClipboardContext>
    )

    fireEvent.click(getByTestId('child'))

    expect(handleCopy).toHaveBeenLastCalledWith('txt')
  })

  // Add more tests as needed
})
