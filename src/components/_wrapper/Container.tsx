import {
  // eslint-disable-next-line no-restricted-imports
  Container as MuiContainer,
  ContainerProps,
  styled,
} from '@mui/material'
import { CSSProperties, FC } from 'react'

export type CContainerProps = ContainerProps &
  Partial<
    Pick<
      CSSProperties,
      | 'paddingTop'
      | 'paddingBottom'
      | 'marginTop'
      | 'marginBottom'
      | 'paddingRight'
      | 'paddingLeft'
      | 'position'
      | 'zIndex'
    >
  >

export const Container = styled((props: CContainerProps) => {
  const {
    /*  eslint-disable @typescript-eslint/no-unused-vars */
    paddingTop,
    paddingBottom,
    marginBottom,
    marginTop,
    paddingLeft,
    paddingRight,
    position,
    zIndex,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    children,
    ...restProps
  } = props
  return <MuiContainer {...restProps}>{children}</MuiContainer>
})<CContainerProps>(
  ({
    paddingTop,
    paddingBottom,
    marginBottom,
    marginTop,
    paddingLeft,
    paddingRight,
    position,
    zIndex,
  }) => ({
    paddingTop,
    paddingBottom,
    marginBottom,
    marginTop,
    paddingLeft,
    paddingRight,
    position,
    zIndex,
  })
) as FC<ContainerProps>
