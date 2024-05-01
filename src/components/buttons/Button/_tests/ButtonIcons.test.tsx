import { render, fireEvent, act, getByRole } from '@testing-library/react'
import { Button } from '../Button'
import { mdiTestTube } from '@mdi/js'
import { ButtonDropdown } from '../defs'

describe('Button Icons', () => {
  describe('ButtonStartIcon', () => {
    it('renders with correct icon (icon is ReactElement)', () => {
      const { getByTestId } = render(
        <div>
          <Button icon={<span data-testid="icon">Icon</span>} />
          <Button
            icon={<span data-testid="icon2">Icon2</span>}
            variant={'outlined'}
          />
          <Button
            icon={<span data-testid="icon3">Icon3</span>}
            variant={'text'}
          />
        </div>
      )
      expect(getByTestId('icon')).toBeInTheDocument()
      expect(getByTestId('icon2')).toBeInTheDocument()
      expect(getByTestId('icon3')).toBeInTheDocument()
    })

    it('renders with disabled colored icon when disabled and icon is string', () => {
      const { getByTestId } = render(
        <div>
          <Button icon={mdiTestTube} disabled data-testid="button" />
          <Button
            icon={mdiTestTube}
            disabled
            data-testid="button2"
            variant="outlined"
          />
          <Button
            icon={mdiTestTube}
            disabled
            data-testid="button3"
            variant="text"
          />
        </div>
      )
      const iconElement = getByTestId('button')
      expect(iconElement).toHaveStyle('color: rgba(0, 0, 0, 0.26);')
      const iconElement2 = getByTestId('button2')
      expect(iconElement2).toHaveStyle('color: rgba(0, 0, 0, 0.26);')
      const iconElement3 = getByTestId('button3')
      expect(iconElement3).toHaveStyle('color: rgba(0, 0, 0, 0.26);')
    })

    it('renders with defined iconColor if passed and icon is string', () => {
      const { getByTestId } = render(
        <div>
          <Button icon={mdiTestTube} data-testid="button" iconColor={'red'} />
          <Button
            icon={mdiTestTube}
            data-testid="button2"
            iconColor={'red'}
            variant="outlined"
          />
          <Button
            icon={mdiTestTube}
            data-testid="button3"
            iconColor={'red'}
            variant="text"
          />
        </div>
      )
      const iconElement = getByTestId('button')
      const paths = iconElement.querySelector('path')
      expect(paths).toHaveStyle('fill: red;')
      const iconElement2 = getByTestId('button2')
      const paths2 = iconElement2.querySelector('path')
      expect(paths2).toHaveStyle('fill: red;')
      const iconElement3 = getByTestId('button3')
      const paths3 = iconElement3.querySelector('path')
      expect(paths3).toHaveStyle('fill: red;')
    })
    it('renders with defined iconSize if passed and icon is string', () => {
      const { getByTestId } = render(
        <div>
          <Button icon={mdiTestTube} data-testid="button" iconSize={'48px'} />
          <Button
            icon={mdiTestTube}
            data-testid="button2"
            iconSize={'48px'}
            variant="outlined"
          />
          <Button
            icon={mdiTestTube}
            data-testid="button3"
            iconSize={'48px'}
            variant="text"
          />
        </div>
      )
      const iconElement = getByTestId('button')
      const paths = iconElement.querySelector('svg')
      expect(paths).toHaveStyle('width: 48px; height: 48px;')
      const iconElement2 = getByTestId('button2')
      const paths2 = iconElement2.querySelector('svg')
      expect(paths2).toHaveStyle('width: 48px; height: 48px;')
      const iconElement3 = getByTestId('button3')
      const paths3 = iconElement3.querySelector('svg')
      expect(paths3).toHaveStyle('width: 48px; height: 48px;')
    })
    it('renders icon in primary color for variant=outlined,text otherwise is contrastText (in most cases #fff) color, icon must be string', () => {
      const { getByTestId } = render(
        <div>
          <Button icon={mdiTestTube} data-testid="button" />
          <Button icon={mdiTestTube} data-testid="button2" variant="outlined" />
          <Button icon={mdiTestTube} data-testid="button3" variant="text" />
        </div>
      )
      const iconElement = getByTestId('button')
      const paths = iconElement.querySelector('path')
      expect(paths).toHaveStyle('fill: #fff;')
      const iconElement2 = getByTestId('button2')
      const path2 = iconElement2.querySelector('path')
      expect(path2).toHaveStyle('fill: rgba(0, 0, 0, 0.87);')
      const iconElement3 = getByTestId('button3')
      const path3 = iconElement3.querySelector('path')
      expect(path3).toHaveStyle('fill: rgba(0, 0, 0, 0.87);')
    })

    it('renders a loading circle if loading is passed', () => {
      const { getByTestId } = render(<Button loading data-testid="button" />)
      const buttonElement = getByTestId('button')
      const loadingCircle = getByRole(buttonElement, 'progressbar')
      expect(loadingCircle).toBeInTheDocument()
    })
  })
  describe('ButtonEndIcon', () => {
    it('renders with correct endIcon', () => {
      const { getByTestId } = render(
        <div>
          <Button endIcon={<span data-testid="end-icon">End Icon</span>} />
          <Button
            endIcon={<span data-testid="end-icon2">End Icon2</span>}
            variant={'outlined'}
          />
          <Button
            endIcon={<span data-testid="end-icon3">End Icon3</span>}
            variant={'text'}
          />
        </div>
      )
      expect(getByTestId('end-icon')).toBeInTheDocument()
      expect(getByTestId('end-icon2')).toBeInTheDocument()
      expect(getByTestId('end-icon3')).toBeInTheDocument()
    })
    it('renders with disabled colored icon when disabled and endIcon is string', () => {
      const { getByTestId } = render(
        <div>
          <Button endIcon={mdiTestTube} disabled data-testid="button" />
          <Button
            endIcon={mdiTestTube}
            disabled
            data-testid="button2"
            variant="outlined"
          />
          <Button
            endIcon={mdiTestTube}
            disabled
            data-testid="button3"
            variant="text"
          />
        </div>
      )
      const iconElement = getByTestId('button')
      expect(iconElement).toHaveStyle('color: rgba(0, 0, 0, 0.26);')
      const iconElement2 = getByTestId('button2')
      expect(iconElement2).toHaveStyle('color: rgba(0, 0, 0, 0.26);')
      const iconElement3 = getByTestId('button3')
      expect(iconElement3).toHaveStyle('color: rgba(0, 0, 0, 0.26);')
    })
    it('renders with defined iconColor if passed and endIcon is string', () => {
      const { getByTestId } = render(
        <div>
          <Button
            endIcon={mdiTestTube}
            data-testid="button"
            iconColor={'red'}
          />
          <Button
            endIcon={mdiTestTube}
            data-testid="button2"
            iconColor={'red'}
            variant="outlined"
          />
          <Button
            endIcon={mdiTestTube}
            data-testid="button3"
            iconColor={'red'}
            variant="text"
          />
        </div>
      )
      const iconElement = getByTestId('button')
      const paths = iconElement.querySelector('path')
      expect(paths).toHaveStyle('fill: red;')
      const iconElement2 = getByTestId('button2')
      const paths2 = iconElement2.querySelector('path')
      expect(paths2).toHaveStyle('fill: red;')
      const iconElement3 = getByTestId('button3')
      const paths3 = iconElement3.querySelector('path')
      expect(paths3).toHaveStyle('fill: red;')
    })
    it('renders a dropdown endicon if dropdown is passed', () => {
      const { getByTestId } = render(
        <div>
          <Button
            endIcon={mdiTestTube}
            data-testid="button"
            dropdown={ButtonDropdown.closed}
          />
          <Button
            endIcon={mdiTestTube}
            data-testid="button2"
            dropdown={ButtonDropdown.open}
            variant="outlined"
          />
        </div>
      )
      const iconElement = getByTestId('button')
      const paths = iconElement.querySelector('path')
      expect(paths).toHaveAttribute(
        'd',
        'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'
      )
      const iconElement2 = getByTestId('button2')
      const paths2 = iconElement2.querySelector('path')
      expect(paths2).toHaveAttribute(
        'd',
        'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z'
      )
    })
  })
})
