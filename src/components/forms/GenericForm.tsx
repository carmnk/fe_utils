import { Fragment, KeyboardEvent, ReactNode } from 'react'
import { Box, BoxProps, Grid2, Grid2Props, Stack } from '@mui/material'
import { getDynamicFields } from './utils'
import { Button, CButtonProps } from '../buttons/Button/Button'
import { mdiDeleteOutline } from '@mdi/js'
import { Field, StaticFieldDefinition } from './fields/Field'
import { SubformField } from './SubformField'
import { GenericInputFieldProps } from '../inputs/types'

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
  _path?: (string | number)[]
  _removeFormFromArray?: () => void
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
    keysDict?: DynamicInjectedDict<any, F>
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

  files?: { [key: string]: { file: File; filename: string }[] }
  onFileChange?: (name: string, files: File[]) => void
  slotProps?: {
    formContainer?: BoxProps
    subformContainer?: BoxProps
    fieldsContainer?: Grid2Props
    fieldContainer?: Grid2Props
    subFormRemoveItemButton?: CButtonProps
    commonFieldProps?: GenericInputFieldProps
  }
  showError?: boolean
  disableTopSpacing?: boolean
  addArrayItemLabel?: string
  useAlwaysArraysInFormData?: boolean
  disableUseFormElement?: boolean
  settings?: {
    gap?: number
    gridWidth?: number | string
  }
  rootInjection?: ReactNode
  useChangeCompleted?: boolean
  disableInitialArrayDivider?: boolean
}

const preventDefault = (e: KeyboardEvent) => {
  if (e.keyCode === 13) return false
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
    slotProps,
    disableUseFormElement,
    rootInjection,
    useChangeCompleted,
    disableInitialArrayDivider,
  } = props

  const {
    subFormRemoveItemButton,
    commonFieldProps,
    formContainer,
    subformContainer,
    fieldContainer,
    fieldsContainer,
  } = slotProps ?? {}

  const { onBeforeChange, onBeforeRemoveArrayItem } = injections ?? {}
  const isFirstArrayElement = _path?.slice(-1)?.[0] === 0
  const dynamicFields = getDynamicFields({
    fields,
    injections,
    formData,
    rootFormData,
  })

  return (
    <Box
      position="relative"
      component={!_path && !disableUseFormElement ? 'form' : (undefined as any)}
      {...(!_path ? formContainer : subformContainer)}
    >
      <Grid2
        container
        spacing={settings?.gap ?? (disableTopSpacing ? '0 16px' : '16px')}
        pr={settings?.gap ?? '16px'}
        width={settings?.gridWidth} //?? 'calc(100% - 64px)'}
        {...fieldsContainer}
      >
        {dynamicFields
          // ?.filter(
          //   (field) =>
          //     !['array', 'object', 'string-array']?.includes(field.type)
          // )
          ?.map((field, fIdx) => {
            const width12 =
              typeof field.width12 === 'number'
                ? { xs: field?.width12 ?? 12 }
                : typeof field.width12 === 'object'
                  ? field.width12
                  : { xs: 12 }
            const fillWidth12 =
              field?.width12 && field?.fillWidth
                ? typeof field?.width12 === 'number'
                  ? { xs: 12 - field.width12 }
                  : typeof field.width12 === 'object'
                    ? {
                        xs: 12 - (field.width12?.xs ?? 12),
                        sm: 12 - (field.width12?.sm ?? 12),
                        md: 12 - (field.width12?.md ?? 12),
                        lg: 12 - (field.width12?.lg ?? 12),
                        xl: 12 - (field.width12?.xl ?? 12),
                      }
                    : {}
                : {}
            return !['array', 'object', 'string-array']?.includes(
              field.type
            ) ? (
              <Fragment key={fIdx}>
                <Grid2
                size={width12}
                  alignSelf={field.type === 'bool' ? 'flex-end' : undefined}
                  display={field?.hidden ? 'none' : undefined}
                  {...fieldContainer}
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
                    fieldProps={commonFieldProps}
                    key={field.name}
                    useChangeCompleted={useChangeCompleted}
                    fields={fields}
                    subforms={subforms}
                  />
                </Grid2>
                {field?.width12 && field?.fillWidth && (
                  <Grid2 size={fillWidth12} />
                )}
              </Fragment>
            ) : (
              <Grid2
                size={width12}
                // alignSelf={field.type === 'bool' ? 'flex-end' : undefined}
                display={field?.hidden ? 'none' : undefined}
                {...fieldContainer}
              >
                <SubformField
                  fIdx={fIdx}
                  formData={formData}
                  rootFormData={rootFormData}
                  onChangeFormData={onChangeFormData}
                  showError={!!showError}
                  field={field as any}
                  injections={injections}
                  subforms={subforms}
                  settings={settings}
                  useAlwaysArraysInFormData={!!useAlwaysArraysInFormData}
                  _path={_path}
                  slotProps={slotProps}
                  disableUseFormElement={disableUseFormElement}
                  key={field.name}
                  disableInitialDivider={disableInitialArrayDivider}
                />
              </Grid2>
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
      </Grid2>

      {/* <StringArrayFormField
        formData={formData}
        onChangeFormData={onChangeFormData}
        rootFormData={rootFormData}
        onChangeFormDataRoot={onChangeFormDataRoot}
        dynamicFields={dynamicFields}
        injections={injections}
        onBeforeRemoveArrayItem={onBeforeRemoveArrayItem}
        onBeforeChange={onBeforeChange}
        showError={showError}
      /> */}
      {/* <Subforms
        slotProps={slotProps}
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
      /> */}
      {!_path && rootInjection}
    </Box>
  )
}
