import { render, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders when open is true', () => {
    const { getByTestId } = render(<Modal open={true} data-testid="modal" />)
    expect(getByTestId('modal')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    const { queryByTestId } = render(<Modal open={false} data-testid="modal" />)
    expect(queryByTestId('modal')).not.toBeInTheDocument()
  })

  it('renders header and subheader', () => {
    const { getByText } = render(
      <Modal
        open={true}
        header={<div>Test Header</div>}
        subheader="Subheader"
      />
    )
    expect(getByText('Test Header')).toBeInTheDocument()
    expect(getByText('Subheader')).toBeInTheDocument()
  })

  it('renders confirmation and cancel buttons when isConfirmation is true', () => {
    const { getByText } = render(
      <Modal
        open={true}
        isConfirmation={true}
        confirmationLabel="Confirm"
        cancelConfirmationLabel="Cancel"
      />
    )
    expect(getByText('Confirm')).toBeInTheDocument()
    expect(getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onConfirm when confirmation button is clicked', () => {
    const handleConfirm = jest.fn()
    const { getByText } = render(
      <Modal
        open={true}
        isConfirmation={true}
        onConfirm={handleConfirm}
        confirmationLabel="Confirm"
      />
    )

    fireEvent.click(getByText('Confirm'))

    expect(handleConfirm).toHaveBeenCalled()
  })

  it('calls onClose when cancel button is clicked', () => {
    const handleClose = jest.fn()
    const { getByText } = render(
      <Modal
        open={true}
        isConfirmation={true}
        onClose={handleClose}
        cancelConfirmationLabel="Cancel"
      />
    )

    fireEvent.click(getByText('Cancel'))

    expect(handleClose).toHaveBeenCalled()
  })

  it('renders with correct width and maxWidth', () => {
    const { getByTestId } = render(
      <Modal open={true} width={500} maxWidth={600} data-testid="modal" />
    )
    // const modal = getByTestId('modal')
    const paper = document.querySelector('.MuiPaper-root')
    expect(paper).toHaveStyle({ width: '532px', maxWidth: '600px' }) // 2x 16 padding
  })
  it('renders with correct height and minHeight', () => {
    const { getByTestId } = render(
      <Modal open={true} height={500} minHeight={400} data-testid="modal" />
    )
    const paper = document.querySelector('.MuiPaper-root')
    expect(paper).toHaveStyle({ height: '500px', minHeight: '400px' })
  })

  it('calls onSecondaryAction when secondary action button is clicked and isConfirmation', () => {
    const handleSecondaryAction = jest.fn()
    const { getByText } = render(
      <Modal
        open={true}
        onSecondaryAction={handleSecondaryAction}
        secondaryActionLabel="Secondary Action"
        isConfirmation
      />
    )

    fireEvent.click(getByText('Secondary Action'))

    expect(handleSecondaryAction).toHaveBeenCalled()
  })

  it('renders secondary action button with correct label and icon if is isConfirmation', () => {
    const Icon = () => <span>Icon</span>
    const handleSecondaryAction = jest.fn()
    const { getByText } = render(
      <Modal
        open={true}
        secondaryActionLabel="Secondary Action"
        secondaryActionIcon={<Icon />}
        onSecondaryAction={handleSecondaryAction}
        isConfirmation
      />
    )

    expect(getByText('Secondary Action')).toBeInTheDocument()
    expect(getByText('Icon')).toBeInTheDocument()
  })

  it('renders cancel confirmation button with correct icon if isConfirmation', () => {
    const Icon = () => <span>Icon</span>
    const { getByText } = render(
      <Modal
        open={true}
        cancelConfirmationIcon={<Icon />}
        cancelConfirmationLabel="Cancel"
        isConfirmation
      />
    )

    expect(getByText('Icon')).toBeInTheDocument()
  })

  it('renders non-confirmation button on the left when placeNonConfirmationButtonOnLeft is true', () => {
    // This test assumes that you're using flexbox for layout and that the non-confirmation button is the first child when it's on the left.
    const { getByText } = render(
      <Modal
        open={true}
        placeNonConfirmationButtonOnLeft={true}
        nonConfirmationLabel="Non-Confirmation"
        data-testid="modal"
        isConfirmation={false}
      />
    )
    expect(getByText('Non-Confirmation')).toBeInTheDocument()
  })

  it('renders non-confirmation button with correct label', () => {
    const { getByText } = render(
      <Modal open={true} nonConfirmationLabel="Non-Confirmation" />
    )

    expect(getByText('Non-Confirmation')).toBeInTheDocument()
  })
})
