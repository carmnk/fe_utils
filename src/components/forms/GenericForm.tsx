import React from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { getDynamicFields } from './utils'
import { Button } from '../buttons/Button/Button'
import { mdiDeleteOutline } from '@mdi/js'
import { Field, StaticFieldDefinition } from './fields/Field'
import { Subforms } from './Subforms'
import { StringArrayFormField } from './fields/StringArrayField'

export type GenericFormParams<F extends { [key: string]: any }> = Omit<
  GenericFormProps<F>,
  'formData' | 'onChangeFormData'
>

type DynamicInjected<Type, FormdataType, RootFormDataType = any> =
  | Type
  | ((formData: FormdataType, rootFormData: RootFormDataType) => Type)
type DynamicInjectedDict<Type, FormDataType, RootFormDataType = any> = {
  [key: string]: DynamicInjected<Type, FormDataType, RootFormDataType>
}
type DynamicRootInjected<FormDataType> =
  | FormDataType
  | ((
      formData: FormDataType,
      rootFormData: any,
      arrayIdx: number
    ) => FormDataType)

export type GenericFormProps<
  F extends { [key: string]: any } = { [key: string]: any },
> = {
  addArrayItemLabel?: string
  useAlwaysArraysInFormData?: boolean
  fields: DynamicInjected<StaticFieldDefinition[], F> // StaticFieldDefinition[] | ((formData: F) => StaticFieldDefinition[])
  injections?: {
    initialFormData?: DynamicRootInjected<F>
    options?: DynamicInjectedDict<any[], F>
    disabled?: DynamicInjectedDict<boolean, F>
    hidden?: DynamicInjectedDict<boolean, F>
    invisible?: DynamicInjectedDict<boolean, F>
    required?: DynamicInjectedDict<boolean, F>
    error?: DynamicInjectedDict<boolean, F>
    helperText?: DynamicInjectedDict<boolean, F>

    onBeforeChange?: (
      newFormData: F,
      prevFormData: F,
      changedPropertyName: keyof F & string,
      changedPropertyValue: any
    ) => F
    onBeforeRemoveArrayItem?: (
      newFormData: F,
      prevFormData: F,
      changedPropertyName: keyof F & string,
      deletedIndex: number
    ) => F
  }
  subforms?: {
    [key in keyof F as string]: Omit<
      GenericFormProps<F>,
      'formData' | 'onChangeFormData'
    >
  }
  settings?: {
    gap?: number
    gridWidth?: number | string
  }
  formData: F
  onChangeFormData: (
    newFormData: F,
    changedPropertyName: keyof F & string,
    changedPropertyValue: any,
    prevFormData: F,
    subformName?: string // better path?
  ) => void
  rootFormData?: any
  onChangeFormDataRoot?: (newFormData: any) => void
  showError?: boolean
  _path?: (string | number)[]
  _removeFormFromArray?: () => void
  disableTopSpacing?: boolean
  files?: { [key: string]: { file: File; filename: string }[] }
  onFileChange?: (name: string, files: File[]) => void
}

export const GenericForm = (props: GenericFormProps) => {
  const {
    fields,
    injections,
    settings,
    subforms,
    formData,
    onChangeFormData,
    _removeFormFromArray,
    onChangeFormDataRoot,
    rootFormData,
    _path,
    showError,
    // addArrayItemLabel,
    useAlwaysArraysInFormData,
    disableTopSpacing,
    onFileChange,
    files,
  } = props
  const { onBeforeChange, onBeforeRemoveArrayItem } = injections ?? {}
  const isFirstArrayElement = _path?.slice(-1)?.[0] === 0
  const dynamicFields = getDynamicFields({
    fields,
    injections,
    formData,
    rootFormData,
  })

  return (
    <>
      <Box position="relative">
        <Grid
          container
          spacing={settings?.gap ?? (disableTopSpacing ? '0 16px' : '16px')}
          pr={settings?.gap ?? '16px'}
          width={settings?.gridWidth ?? 'calc(100% - 64px)'}
        >
          {dynamicFields
            ?.filter(
              (field) =>
                !['array', 'object', 'string-array']?.includes(field.type)
            )
            ?.map((field, fIdx) => {
              return (
                <React.Fragment key={fIdx}>
                  <Grid
                    item
                    xs={field.width12 ?? 12}
                    alignSelf={field.type === 'bool' ? 'flex-end' : undefined}
                    display={field?.hidden ? 'none' : undefined}
                  >
                    <Field
                      onBeforeChange={onBeforeChange}
                      formData={formData}
                      rootFormData={rootFormData}
                      onChangeFormData={onChangeFormData}
                      onChangeFormDataRoot={onChangeFormDataRoot}
                      _path={_path}
                      showError={showError}
                      field={field as any}
                      onFileChange={onFileChange}
                      files={files}
                    />
                  </Grid>
                  {field?.width12 && field?.fillWidth && (
                    <Grid item xs={12 - field.width12} />
                  )}
                </React.Fragment>
              )
            })}
          {!isFirstArrayElement && _removeFormFromArray && (
            <Stack
              direction="row"
              position="absolute"
              right={0}
              top={0}
              // pt={options?.gap ?? 16 + 25 + 'px'}
              // pb="36px"
              height="100%"
              width={64}
              alignItems="center"
            >
              <Box>
                <Button
                  variant="text"
                  iconButton={true}
                  icon={mdiDeleteOutline}
                  onClick={() => {
                    // alert("F")
                    _removeFormFromArray?.()
                  }}
                />
              </Box>
            </Stack>
          )}
        </Grid>
      </Box>
      <StringArrayFormField
        formData={formData}
        onChangeFormData={onChangeFormData}
        rootFormData={rootFormData}
        onChangeFormDataRoot={onChangeFormDataRoot}
        dynamicFields={dynamicFields}
        injections={injections}
        onBeforeRemoveArrayItem={onBeforeRemoveArrayItem}
        onBeforeChange={onBeforeChange}
        showError={showError}
      />
      <Subforms
        dynamicFields={dynamicFields}
        formData={formData}
        onChangeFormData={onChangeFormData}
        rootFormData={rootFormData}
        // onChangeFormDataRoot={onChangeFormDataRoot}
        showError={showError}
        subforms={subforms}
        useAlwaysArraysInFormData={useAlwaysArraysInFormData}
        _path={_path}
        settings={settings}
        _removeFormFromArray={_removeFormFromArray}
      />
    </>
  )
}
