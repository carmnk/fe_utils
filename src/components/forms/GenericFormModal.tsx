import { ReactNode, useCallback, useState } from 'react'
import {
  GenericForm,
  GenericFormParams,
} from '../../components/forms/GenericForm'
import { Modal, CModalProps } from '../surfaces/Modal'

export type GenericFormModalProps<
  F extends { [key: string]: any } = { [key: string]: any },
> = Omit<
  CModalProps,
  | 'hideConfirmationButton'
  | 'nonConfirmationLabel'
  | 'placeNonConfirmationButtonOnLeft'
  | 'isConfirmation'
  | 'onClose'
  | 'onConfirm'
  | 'open'
> & {
  onClose: () => void
  onConfirm: (newFormdata: F) => void
  formProps: GenericFormParams<F>
  subheader?: ReactNode
  // gridWidth?: number | string
  formData?: F
  setFormData?: (newFormData: F) => void
  files?: { [key: string]: { file: File; filename: string }[] }
  onFileChange?: (name: string, files: File[]) => void
}

export function GenericFormModal<
  F extends { [key: string]: any } = { [key: string]: any },
>(props: GenericFormModalProps<F>) {
  const {
    formProps,
    onConfirm,
    subheader,
    formData: formDataIn,
    setFormData: setFormDataIn,
    files,
    onFileChange,
  } = props
  const { fields: fieldsIn, injections, settings } = formProps ?? {}

  const [formData, setFormData] = useState<any>(
    injections?.initialFormData ?? {}
  )
  const formDataAdj = formDataIn ?? formData
  const [showError, setShowError] = useState(false)
  const handleOnConfirm = useCallback(() => {
    onConfirm(formDataAdj)
    setShowError(true)
  }, [formDataAdj, onConfirm])

  const fields =
    typeof fieldsIn === 'function' ? fieldsIn(formDataAdj, {}) : fieldsIn

  return (
    <Modal
      maxWidth={1024}
      height={1024}
      {...props}
      disableCloseOnConfirmation={true}
      open={true}
      isConfirmation={true}
      onConfirm={handleOnConfirm}
    >
      {/* {typeof subheader === 'string' ? (
        <Typography>{subheader}</Typography>
      ) : subheader ? (
        subheader
      ) : null}*/}
      <GenericForm
        fields={fields ?? []}
        injections={injections as any}
        formData={formDataAdj}
        onChangeFormData={(setFormDataIn as any) ?? setFormData}
        settings={settings}
        showError={showError}
        files={files}
        onFileChange={onFileChange}
      />
    </Modal>
  )
}
