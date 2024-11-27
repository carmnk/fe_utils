import { useState, useCallback } from 'react'
import { FormDataType, GenericFormParams, GenericFormProps } from './types'

export type UseFormParams = GenericFormParams
// & {
// fields: GenericFormParams<F>['fields']
// subforms?: GenericFormParams<F>['subforms']
// showError?: boolean
// onSubmit?: (formData: F) => F
// }

export const useForm = <F extends FormDataType = FormDataType>(
  params: UseFormParams
): GenericFormProps<F> => {
  // const { fields, subforms, injections } = params
  const [formData, setFormData] = useState<F>({} as F)

  const onChangeFormData = useCallback(
    (
      newFormData: F
      // changedPropertyName: keyof F,
      // changedValue: any,
      // prevFormData: F
    ) => {
      setFormData(newFormData)
    },
    []
  )
  // const subformFields = fields?.filter((field) => ['array', 'object', 'string-array'].includes(field.type)) // "array", "object", "string-array"
  // const [formData, setFormData] = useState<F>({} as F)

  return {
    ...(params as GenericFormProps<F>),
    formData,
    onChangeFormData,
  }
}
