import { Box } from '@mui/material'
import { useEffect, useMemo } from 'react'

/** the properties/params to define a custom field in the generic form's -> fields property  */
export type CustomFieldDefinition<F, P> = {
  type: 'inject'
  name: string
  component: React.FC<CustomFieldComponentProps<F, P>>
  params?: P
}

/** the properties which are passed to the react component, partly from the generic form */
export type CustomFieldComponentProps<F, P> = {
  formData: F
  onChangeFormData: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: any,
    prevFormData: F
  ) => void
  onBeforeChange?: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: any,
    prevFormData: F
  ) => void
  params?: P
  rootFormData?: any
  onChangeFormDataRoot?: (newFormData: any) => void
  _path?: (string | number)[]
  field: CustomFieldDefinition<F, P>
  onFileChange?: (name: string, files: File[]) => void
  files?: { [key: string]: { file: File; filename: string }[] }
}

export const CustomField = <
  F extends { [key: string]: any },
  Params extends { [key: string]: any },
>(
  props: CustomFieldComponentProps<F, Params>
) => {
  const {
    formData,
    onChangeFormData,
    onChangeFormDataRoot,
    _path,
    // showError,
    onBeforeChange,
    rootFormData,
    field,
    files,
    onFileChange,
  } = props

  const FieldComponent = useMemo(() => field.component, [field])

  // useEffect(() => {
  //   console.log(
  //     'FORM CUSTOM FIELD RENDERS',
  //     field?.name,
  //     field?.type,
  //     formData?.[field?.name ?? '']
  //   )
  // }, [])
  return (
    <Box>
      <FieldComponent
        formData={formData}
        onChangeFormData={onChangeFormData}
        params={field.params}
        rootFormData={rootFormData}
        onChangeFormDataRoot={onChangeFormDataRoot}
        _path={_path}
        onBeforeChange={onBeforeChange}
        // showError={showError}
        files={files}
        onFileChange={onFileChange}
        field={field}
        key={field.name}
      />
    </Box>
  )
}
