import { Modal } from './Modal'
import { CModalProps } from './Modal'

export const AlertDialog = (props: CModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, minWidth, ...rest } = props
  return <Modal width={788} minWidth={788} {...rest} />
}
