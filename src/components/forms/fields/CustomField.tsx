import { Box } from '@mui/material'
import { FC, useMemo } from 'react'
import { GenericFormProps } from '../types'

/** the properties/params to define a custom field in the generic form's -> fields property  */
export type CustomFieldDefinition<F, P> = {
  type: 'inject'
  name: string
  component: FC<CustomFieldComponentProps<F, P>>
  params: P
  key?: string
}

/** the properties which are passed to the react component, partly from the generic form */
export type CustomFieldComponentProps<F, P> = {
  formData: F
  onChangeFormData: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: unknown,
    prevFormData: F
  ) => void
  onBeforeChange?: NonNullable<GenericFormProps['injections']>['onBeforeChange']
  params: P
  rootFormData?: any
  onChangeFormDataRoot?: (newFormData: any) => void
  _path?: (string | number)[]
  field: CustomFieldDefinition<F, P>
  onFileChange?: (name: string, files: File[]) => void
  files?: { [key: string]: { file: File; filename: string }[] }
  fields: any
  subforms: any
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
    onBeforeChange,
    rootFormData,
    field,
    files,
    onFileChange,
    fields,
    subforms,
  } = props

  const FieldComponent = useMemo(() => field.component, [field])

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
        files={files}
        onFileChange={onFileChange}
        field={field}
        key={field.name}
        fields={fields}
        subforms={subforms}
      />
    </Box>
  )
}
