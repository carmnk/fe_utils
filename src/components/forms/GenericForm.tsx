import { Fragment } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { getDynamicFields } from './utils'
import { Button } from '../buttons/Button/Button'
import { mdiDeleteOutline } from '@mdi/js'
import { Field, StaticFieldDefinition } from './fields/Field'
import { SubformField } from './SubformField'
import { FormDataType, GenericFormProps } from './types'

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
    // subFormRemoveItemButton,
    commonFieldProps,
    formContainer,
    subformContainer,
    fieldContainer,
    fieldsContainer,
  } = slotProps ?? {}

  const {
    onBeforeChange,
    // onBeforeRemoveArrayItem
  } = injections ?? {}
  const isFirstArrayElement = _path?.slice(-1)?.[0] === 0
  const dynamicFields = getDynamicFields({
    fields,
    injections,
    formData,
    rootFormData: rootFormData as FormDataType,
  })

  return (
    <Box
      position="relative"
      component={!_path && !disableUseFormElement ? 'form' : undefined}
      {...(!_path ? formContainer : subformContainer)}
    >
      <Grid
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
                <Grid
                  item
                  {...width12}
                  alignSelf={field.type === 'bool' ? 'flex-end' : undefined}
                  display={field?.hidden ? 'none' : undefined}
                  {...fieldContainer}
                >
                  <Field
                    onBeforeChange={onBeforeChange}
                    formData={formData}
                    rootFormData={rootFormData as FormDataType}
                    onChangeFormData={onChangeFormData}
                    onChangeFormDataRoot={onChangeFormDataRoot}
                    _path={_path ?? []}
                    showError={showError}
                    field={field as StaticFieldDefinition<'inject'>}
                    onFileChange={onFileChange}
                    files={files}
                    fieldProps={commonFieldProps}
                    key={field.name}
                    useChangeCompleted={useChangeCompleted}
                    fields={fields}
                    subforms={subforms}
                  />
                </Grid>
                {field?.width12 && field?.fillWidth && (
                  <Grid item {...fillWidth12} />
                )}
              </Fragment>
            ) : (
              <Grid
                item
                // xs={field.width12 ?? 12}
                {...width12}
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
                  field={field}
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
              </Grid>
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
