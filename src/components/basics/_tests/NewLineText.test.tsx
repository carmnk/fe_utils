import { render } from '@testing-library/react'
import { NewlineText } from '../NewLineText'

describe('NewlineText', () => {
  it('renders each line of text as a separate paragraph', () => {
    const text = 'Line 1\nLine 2\nLine 3'
    render(<NewlineText text={text} />)

    const paragraphs = document.querySelectorAll('span')
    // expect(getAllByRole('avatar')).toHaveStyle('background-color: red')
    expect(paragraphs).toHaveLength(3)
    expect(paragraphs[0]).toHaveTextContent('Line 1')
    expect(paragraphs[1]).toHaveTextContent('Line 2')
    expect(paragraphs[2]).toHaveTextContent('Line 3')
  })

  it('renders nothing when text is undefined', () => {
    const { container } = render(<NewlineText text={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })
})
