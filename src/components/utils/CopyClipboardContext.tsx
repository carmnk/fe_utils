import { FC, PropsWithChildren } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'

export const CopyClipboardContext: FC<
  PropsWithChildren<CopyToClipboard.Props> & { disableCopy?: boolean }
> = (props: CopyToClipboard.Props & { disableCopy?: boolean }) =>
  props?.disableCopy ? (
    props?.children
  ) : (
    <CopyToClipboard text={props?.text ?? ''} onCopy={props?.onCopy}>
      {props?.children}
    </CopyToClipboard>
  )
