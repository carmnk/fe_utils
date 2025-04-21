import { mdiPlus } from '@mdi/js'
import { Fragment } from 'react'
import { Button } from '../../buttons/Button'
import { DynamicFieldDefinition } from './Field'
import { StringArrayField } from '../../inputs/StringArrayField'
import { GenericFormProps } from '../types'

type FormDataType = Record<string, unknown[]>

export type StringArrayFieldProps = {
  formData: FormDataType
  onChangeFormData: GenericFormProps['onChangeFormData']
  rootFormData: FormDataType
  showError?: boolean
  dynamicFields: DynamicFieldDefinition[]
  injections: GenericFormProps['injections']
  onBeforeRemoveArrayItem: (
    transformedNewFormData: FormDataType,
    formData: FormDataType,
    name: string,
    arrayIndex: number
  ) => unknown
}

export const StringArrayFormField = (props: StringArrayFieldProps) => {
  const {
    formData,
    onChangeFormData,
    rootFormData,
    dynamicFields,
    injections,
    onBeforeRemoveArrayItem,
  } = props as StringArrayFieldProps

  return dynamicFields
    ?.filter((field) => ['string-array']?.includes(field.type))
    ?.map((field, fIdx) => {
      const fieldName = field?.name
      if (!fieldName) return null
      const onChangeObjectSub = (
        newValue: string,
        _name: string | undefined,
        arrayIdx: number | undefined
        // prevFormData: any
      ) => {
        if (arrayIdx === undefined) return
        const transformedNewFormData = {
          ...formData,
          [fieldName]: [
            ...(formData?.[fieldName]?.slice(0, arrayIdx) ?? []),
            newValue,
            ...(formData?.[fieldName]?.slice(arrayIdx + 1) ?? []),
          ],
        }
        onChangeFormData?.(
          transformedNewFormData,
          fieldName,
          newValue,
          formData
        )
      }

      const onAddObjectSub = () => {
        const newValue = [...(formData?.[fieldName] ?? []), '']
        const transformedNewFormData = {
          ...formData,
          [fieldName]: newValue,
        }
        onChangeFormData?.(
          transformedNewFormData,
          fieldName,
          newValue,
          formData
        )
      }

      const removeItemArraySub = (
        _name: string | undefined,
        arrayIndex: number
      ) => {
        if (!field?.name) return
        const newValue = formData?.[field?.name]?.filter(
          (_dat: unknown, dIdx: number) => dIdx !== arrayIndex
        )
        const transformedNewFormData = {
          ...formData,
          [field.name]: newValue,
        }
        const injectedFormData =
          onBeforeRemoveArrayItem?.(
            transformedNewFormData,
            formData,
            field.name,
            arrayIndex
          ) ?? transformedNewFormData
        onChangeFormData?.(
          injectedFormData as FormDataType,
          field.name,
          newValue,
          formData
        )
      }

      const requiredInjection = injections?.required?.[fieldName]
      const required =
        typeof requiredInjection === 'function'
          ? requiredInjection?.(formData, rootFormData)
          : requiredInjection

      const errorInjection = injections?.error?.[fieldName]
      const error =
        typeof errorInjection === 'function'
          ? errorInjection?.(formData, rootFormData)
          : errorInjection

      const disabledInjection = injections?.disabled?.[fieldName]
      const disabled =
        typeof disabledInjection === 'function'
          ? disabledInjection?.(formData, rootFormData)
          : disabledInjection

      // const disabledInjection = injections?.disabled?.[fieldName]
      // const disabled = typeof disabledInjection === 'function' ? disabledInjection?.(formData) : disabledInjection
      return (
        <Fragment key={fIdx}>
          <StringArrayField
            {...field}
            name={fieldName}
            value={formData?.[fieldName] as string[]}
            label={(field as any)?.label}
            required={!!required}
            disabled={!!disabled}
            onChangeArray={onChangeObjectSub as any}
            onRemoveItem={removeItemArraySub}
            enableDeleteFirst={(field as any)?.enableDeleteFirst}
            // showError={showError}
            error={error}
          />

          <Button
            variant="outlined"
            label={'Add'}
            onClick={onAddObjectSub}
            icon={mdiPlus}
          />
        </Fragment>
      )
    })
}
