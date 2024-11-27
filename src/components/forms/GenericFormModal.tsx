import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import { GenericForm } from './GenericForm'
import type { FormDataType, GenericFormParams } from './types'
import { Modal, CModalProps } from '../surfaces/Modal'

export type GenericFormModalProps<F extends FormDataType = FormDataType> = Omit<
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
  formProps: GenericFormParams
  subheader?: ReactNode
  // gridWidth?: number | string
  formData?: F
  // setFormData?: (newFormData: F) => void
  setFormData?: Dispatch<SetStateAction<F>>
  files?: { [key: string]: { file: File; filename: string }[] }
  onFileChange?: (name: string, files: File[]) => void
}

export function GenericFormModal<F extends FormDataType = FormDataType>(
  props: GenericFormModalProps<F>
) {
  const {
    formProps,
    onConfirm,
    // subheader,
    formData: formDataIn,
    setFormData: setFormDataIn,
    files,
    onFileChange,
  } = props
  const { fields: fieldsIn, injections, settings } = formProps ?? {}

  const [formData, setFormData] = useState<FormDataType>(
    (injections?.initialFormData as FormDataType) ?? {}
  )
  const formDataAdj = formDataIn ?? formData
  const [showError, setShowError] = useState(false)
  const handleOnConfirm = useCallback(() => {
    onConfirm(formDataAdj as F)
    setShowError(true)
  }, [formDataAdj, onConfirm])

  const fields =
    typeof fieldsIn === 'function' ? fieldsIn(formDataAdj as F, {}) : fieldsIn

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
        injections={injections}
        formData={formDataAdj}
        onChangeFormData={
          (setFormDataIn as Dispatch<SetStateAction<FormDataType>>) ??
          setFormData
        }
        settings={settings}
        showError={showError}
        files={files}
        onFileChange={onFileChange}
      />
    </Modal>
  )
}
