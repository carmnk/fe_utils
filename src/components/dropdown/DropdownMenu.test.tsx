import { render, fireEvent, queryByText } from '@testing-library/react'
import { DropdownMenu } from './DropdownMenu'

const testConent = 'CONTENT'
const testId = 'ID'

describe('DropdownMenu', () => {
  it('renders the menu when open', () => {
    const { queryByText } = render(
      <DropdownMenu
        anchorEl={null as any}
        open={true}
        onClose={() => {}}
        id={testId}
      >
        {testConent}
      </DropdownMenu>
    )
    expect(queryByText(testConent)).toBeInTheDocument()
  })

  it('does not render menu when not open', () => {
    const { queryByText } = render(
      <DropdownMenu
        anchorEl={null as any}
        open={false}
        onClose={() => {}}
        id={testId}
      >
        {testConent}
      </DropdownMenu>
    )
    expect(queryByText(testConent)).not.toBeInTheDocument()
  })

  it('renders the items correctly when open', () => {
    const hasClicked = jest.fn()
    const testItems = [
      {
        label: 'Item 1',
        id: '1',
        onClick: () => {
          hasClicked('1')
        },
      },
      {
        label: 'Item 2',
        id: '2',
        onClick: () => {
          hasClicked('2')
        },
      },
      {
        label: 'Item 3',
        id: '3',
        onClick: () => {
          hasClicked('3')
        },
      },
    ]
    const { queryByText } = render(
      <DropdownMenu
        anchorEl={null as any}
        open={true}
        onClose={() => {}}
        id={testId}
        items={testItems}
      />
    )

    testItems.forEach((item) => {
      const itemElement = queryByText(item.label)
      expect(itemElement).toBeInTheDocument()
      if (itemElement) {
        fireEvent.click(itemElement)
      }
      expect(hasClicked).toHaveBeenCalledWith(item.id)
    })
  })
  // Add more tests as needed
})
