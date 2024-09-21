import { render, fireEvent, act } from '@testing-library/react'
import { BottomPagination } from '../BottomPagination'
import { Box, ThemeProvider, createTheme, useMediaQuery } from '@mui/material'
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'

const theme = createTheme({})

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: () => true,
}))

describe('BottomPagination', () => {
  it('renders with correct initial page', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <BottomPagination
          pageNumber={1}
          itemPerPage={10}
          changePage={() => {}}
          changeSize={() => {}}
          number={1}
          label="Test Label"
        />
      </ThemeProvider>
    )

    expect(getByText('2 (dev)')).toBeInTheDocument()
    expect(getByText('20')).toBeInTheDocument()
    expect(getByText('50')).toBeInTheDocument()
    expect(getByText('100')).toBeInTheDocument()
    expect(getByText('ALL')).toBeInTheDocument()
  })

  it('renders with correct label', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <BottomPagination
          pageNumber={1}
          itemPerPage={10}
          changePage={() => {}}
          changeSize={() => {}}
          number={1}
          label="Test Label"
        />
      </ThemeProvider>
    )
    expect(getByText('Test Label')).toBeInTheDocument()
  })

  it('it triggers changePage when arrow buttons are used', async () => {
    const handleChangePage = jest.fn()
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <BottomPagination
          pageNumber={2}
          itemPerPage={10}
          changePage={handleChangePage}
          changeSize={() => {}}
          number={100}
          label="Test Label"
        />
      </ThemeProvider>
    )
    const pathElements = document.querySelectorAll('path')
    const arrowForwardPathElement = Array.from(pathElements).find(
      (el) => el.getAttribute('d') === mdiArrowRight
    )
    const arrowForwardSvgElement = arrowForwardPathElement?.parentElement
    const arrowForwardButtonElement =
      arrowForwardSvgElement?.parentElement?.parentElement

    await act(async () => {
      await fireEvent.click(arrowForwardButtonElement, {})
    })
    expect(arrowForwardButtonElement?.tagName === 'BUTTON').toBe(true)
    expect(handleChangePage).toHaveBeenCalledWith(3)

    const arrowBackwardsPathElement = Array.from(pathElements).find(
      (el) => el.getAttribute('d') === mdiArrowLeft
    )
    const arrowBackwardsSvgElement = arrowBackwardsPathElement?.parentElement
    const arrowBackwardsButtonElement =
      arrowBackwardsSvgElement?.parentElement?.parentElement

    await act(async () => {
      await fireEvent.click(arrowBackwardsButtonElement, {})
    })
    expect(arrowBackwardsButtonElement?.tagName === 'BUTTON').toBe(true)
    expect(handleChangePage).toHaveBeenCalledWith(1)
  })

  it('triggers changeSize and changePage(1) if another pagination size is clicked', async () => {
    const handleChangeSize = jest.fn()
    const handleChangePage = jest.fn()
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <BottomPagination
          pageNumber={1}
          itemPerPage={10}
          changePage={handleChangePage}
          changeSize={handleChangeSize}
          number={1}
          label="Test Label"
        />
      </ThemeProvider>
    )
    await act(async () => {
      await fireEvent.click(getByText('2 (dev)'), {})
      await fireEvent.click(getByText('20'), {})
      await fireEvent.click(getByText('50'), {})
      await fireEvent.click(getByText('100'), {})
      await fireEvent.click(getByText('ALL'), {})
    })
    expect(handleChangeSize).toHaveBeenCalledTimes(5)
    expect(handleChangeSize).toHaveBeenNthCalledWith(1, 2)
    expect(handleChangeSize).toHaveBeenNthCalledWith(2, 20)
    expect(handleChangeSize).toHaveBeenNthCalledWith(3, 50)
    expect(handleChangeSize).toHaveBeenNthCalledWith(4, 100)
    expect(handleChangeSize).toHaveBeenNthCalledWith(5, 99999)
    expect(handleChangePage).toHaveBeenCalledTimes(5)
    expect(handleChangePage).toHaveBeenNthCalledWith(1, 1)
    expect(handleChangePage).toHaveBeenNthCalledWith(2, 1)
    expect(handleChangePage).toHaveBeenNthCalledWith(3, 1)
    expect(handleChangePage).toHaveBeenNthCalledWith(4, 1)
    expect(handleChangePage).toHaveBeenNthCalledWith(5, 1)
  })

  //   it('calls onChange when a different page is selected', () => {
  //     const handleChange = jest.fn()
  //     const { getByLabelText } = render(
  //       <BottomPagination page={1} count={10} onChange={handleChange} />
  //     )
  //     fireEvent.click(getByLabelText('Go to page 2'))
  //     expect(handleChange).toHaveBeenCalledWith(expect.anything(), 2)
  //   })

  // Continue with tests for other properties...
})
