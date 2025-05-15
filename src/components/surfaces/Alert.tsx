import { ReactNode } from 'react'
import { Modal } from './Modal'
import { CModalProps } from './Modal'

export const AlertDialog = (
  props: Omit<CModalProps, 'children'> & { children?: ReactNode }
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, minWidth, children, ...rest } = props
  return (
    <Modal width={788} minWidth={788} {...rest}>
      {children}
    </Modal>
  )
}
