import { Link, LinkProps } from '@mui/material'
import { ReactNode } from 'react'
import { CommonComponentPropertys } from '../../componentProperty'

export type LinkWrapperProps = CommonComponentPropertys &
  LinkProps & {
    rootInjection: ReactNode
  }
export const LinkWrapper = (props: LinkWrapperProps) => {
  const {
    children,
    rootInjection,
    /* eslint-disable @typescript-eslint/no-unused-vars */
    appController,
    editorStateUi,
    assets,
    id,
    isProduction,
    icons,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props

  return (
    <Link
      {...rest}
      target={
        rest?.href?.startsWith?.('http://') ||
        rest?.href?.startsWith?.('https://')
          ? '_blank'
          : undefined
      }
      rel={
        rest?.href?.startsWith?.('http://') ||
        rest?.href?.startsWith?.('https://')
          ? 'noopener noreferrer'
          : undefined
      }
    >
      {children}
      {rootInjection}
    </Link>
  )
}
