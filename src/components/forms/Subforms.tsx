import { mdiPlus } from '@mdi/js'
import { Box, Divider, Typography } from '@mui/material'
import { Button } from '../buttons/Button'
import { GenericForm, GenericFormProps } from './GenericForm'
import { DynamicFieldDefinition } from './fields/Field'

export type SubformsProps = {
  dynamicFields: DynamicFieldDefinition[]
  formData: any
  rootFormData: any
  onChangeFormData: any
  showError: any
  subforms: any
  settings: any
  useAlwaysArraysInFormData: any
  _path: any
  _removeFormFromArray?: any
  slotProps?: GenericFormProps['slotProps']
}
export const Subforms = (props: SubformsProps) => {
  const {
    dynamicFields,
    formData,
    rootFormData,
    onChangeFormData,
    showError,
    subforms,
    settings,
    useAlwaysArraysInFormData,
    _path,
    _removeFormFromArray,
    slotProps,
  } = props
  const arrayIdxRaw = _path?.slice(-1)?.[0]
  const ArrayIdx = typeof arrayIdxRaw === 'number' ? arrayIdxRaw : undefined

  return dynamicFields
    ?.filter((field) => ['array', 'object']?.includes(field.type))
    ?.map((field, fIdx) => {
      const fieldName: string | undefined = field?.name
      const subform = subforms?.[fieldName ?? '']
      if (!fieldName || !subform) return null
      const onChangeObjectSub = (
        newFormData: any,
        changedPropertyName: any,
        changedPropertyValue: any,
        prevFormData: any
      ) => {
        const transformedNewFormData = {
          ...formData,
          [fieldName]: useAlwaysArraysInFormData ? [newFormData] : newFormData,
        }
        onChangeFormData?.(
          transformedNewFormData,
          changedPropertyName,
          changedPropertyValue,
          formData,
          fieldName
        )
      }
      const makeOnChangeArraySub =
        (arrayIndex: number) =>
        (
          newFormData: any,
          changedPropertyName: any,
          changedPropertyValue: any,
          prevFormData: any
        ) => {
          if (!fieldName) return
          const transformedNewFormData = {
            ...formData,
            [fieldName]: formData?.[fieldName]?.length
              ? formData?.[fieldName]?.map((f: any, fIdx: number) =>
                  fIdx === arrayIndex ? newFormData : f
                )
              : [newFormData],
          }
          onChangeFormData?.(
            transformedNewFormData,
            changedPropertyName,
            changedPropertyValue,
            formData,
            fieldName
          )
        }
      const addnewItemArraySub = (
        changedPropertyName: any,
        prevFormData: any
      ) => {
        if (!fieldName) return
        const prevArrayFormData = prevFormData?.[fieldName]

        const injectedFormDataRaw =
          subforms?.[fieldName]?.injections?.initialFormData
        const injectedFormData =
          (typeof injectedFormDataRaw === 'function'
            ? injectedFormDataRaw(formData, rootFormData, (ArrayIdx ?? -1) + 1)
            : injectedFormDataRaw) ?? {}

        const newValue = [...(prevArrayFormData ?? []), injectedFormData]
        const transformedNewFormData = {
          ...formData,
          [fieldName]: newValue,
        }
        onChangeFormData?.(
          transformedNewFormData,
          changedPropertyName,
          newValue,
          formData
        )
      }

      if (!fieldName || !subform) return null

      return field.type === 'object' &&
        !Array.isArray(subform) &&
        subform?.fields ? (
        <>
          <Box pb={2}>
            <Divider />
          </Box>
          <Box>
            <Typography fontWeight="bold" paddingBottom={1}>
              {fieldName}
            </Typography>
            <GenericForm
              useAlwaysArraysInFormData={useAlwaysArraysInFormData}
              key={fIdx}
              fields={subform?.fields}
              injections={subform?.injections}
              settings={settings}
              formData={
                useAlwaysArraysInFormData
                  ? formData?.[fieldName]?.[0]
                  : formData?.[fieldName]
              } //?? subforms?.[fieldName]?.injections?.initialFormData ?? {}}
              onChangeFormData={onChangeObjectSub}
              rootFormData={formData}
              onChangeFormDataRoot={onChangeFormData as (newValue: any) => void}
              _path={[...(_path ?? []), field.name]}
              showError={showError}
              subforms={subform?.subforms}
              slotProps={slotProps}
            />
          </Box>
        </>
      ) : field.type === 'array' ? (
        <>
          <Box>
            <Divider />
          </Box>
          <Typography fontWeight="bold">{fieldName}</Typography>
          <Box mb={4} key={fIdx}>
            {(formData?.[fieldName]?.length
              ? formData?.[fieldName]
              : [{}]
            )?.map?.((f: any, fIdx2: number) => {
              const removeItemArraySub = () => {
                if (!field?.name) return

                const newValue = formData?.[field?.name]?.filter(
                  (dat: any, dIdx: number) => dIdx !== fIdx
                )
                const transformedNewFormData = {
                  ...formData,
                  [field.name]: newValue,
                }

                const injectedFormData =
                  (
                    subforms?.[fieldName] as any
                  )?.injections?.onBeforeRemoveArrayItem?.(
                    transformedNewFormData,
                    formData,
                    field.name,
                    fIdx
                  ) ?? transformedNewFormData

                onChangeFormData?.(
                  injectedFormData,
                  field.name,
                  newValue,
                  formData
                )
              }
              const sub = subforms?.[field?.name ?? '']
              const injectedFormDataRaw = sub.injections?.initialFormData
              const injectedFormData =
                (typeof injectedFormDataRaw === 'function'
                  ? injectedFormDataRaw(formData, rootFormData, ArrayIdx)
                  : injectedFormDataRaw) ?? {}
              return (
                <Box key={fIdx + '_' + fIdx2}>
                  {fIdx2 ? (
                    <Box mb={2} paddingX={4}>
                      <Divider variant="middle" />
                    </Box>
                  ) : null}
                  <GenericForm
                    useAlwaysArraysInFormData={useAlwaysArraysInFormData}
                    fields={sub?.fields}
                    injections={sub?.injections}
                    settings={settings}
                    onChangeFormData={makeOnChangeArraySub(fIdx2)}
                    onChangeFormDataRoot={
                      onChangeFormData as (newValue: any) => void
                    }
                    formData={
                      formData?.[fieldName]?.[fIdx2] ?? injectedFormData
                    }
                    rootFormData={formData}
                    _removeFormFromArray={removeItemArraySub}
                    _path={[...(_path ?? []), field.name, fIdx2]}
                    showError={showError}
                    disableTopSpacing={true}
                    slotProps={slotProps}
                  />
                </Box>
              )
            })}

            <Button
              variant="outlined"
              label={subforms?.[field?.name ?? '']?.addArrayItemLabel ?? 'Add'}
              onClick={() => addnewItemArraySub(field.name, formData)}
              icon={mdiPlus}
            />
          </Box>
        </>
      ) : null
    })
}
