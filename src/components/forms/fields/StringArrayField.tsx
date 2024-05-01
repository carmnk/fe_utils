import { mdiPlus } from '@mdi/js'
import { Fragment } from 'react'
import { Button } from '../../buttons/Button'
import { DynamicFieldDefinition } from './Field'
import { StringArrayField } from '../../inputs/StringArrayField'

export type StringArrayFieldProps = {
  formData: any
  onChangeFormData: any // (value: any) => void
  rootFormData: any
  onChangeFormDataRoot: any // (value: any) => void
  onBeforeChange?: any //(value: any) => any
  showError?: boolean
  dynamicFields: DynamicFieldDefinition[]
  injections: any
  onBeforeRemoveArrayItem: any
}

export const StringArrayFormField = (props: StringArrayFieldProps) => {
  const {
    formData,
    onChangeFormData,
    onBeforeChange,
    showError,
    rootFormData,
    onChangeFormDataRoot,
    dynamicFields,
    injections,
    onBeforeRemoveArrayItem,
  } = props as StringArrayFieldProps

  console.warn('dynamicFields', dynamicFields)
  return dynamicFields
    ?.filter((field) => ['string-array']?.includes(field.type))
    ?.map((field, fIdx) => {
      const fieldName = field?.name
      if (!fieldName) return null
      const onChangeObjectSub = (
        newValue: string,
        name: string,
        arrayIdx: any
        // prevFormData: any
      ) => {
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

      const removeItemArraySub = (name: string, arrayIndex: number) => {
        if (!field?.name) return
        const newValue = formData?.[field?.name]?.filter(
          (dat: any, dIdx: number) => dIdx !== arrayIndex
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
        onChangeFormData?.(injectedFormData, field.name, newValue, formData)
      }

      const requiredInjection = injections?.required?.[fieldName]
      const required =
        typeof requiredInjection === 'function'
          ? requiredInjection?.(formData)
          : requiredInjection

      const errorInjection = injections?.error?.[fieldName]
      const error =
        typeof errorInjection === 'function'
          ? errorInjection?.(formData, rootFormData)
          : errorInjection

      const disabledInjection = injections?.disabled?.[fieldName]
      const disabled =
        typeof disabledInjection === 'function'
          ? disabledInjection?.(formData)
          : disabledInjection

      // const disabledInjection = injections?.disabled?.[fieldName]
      // const disabled = typeof disabledInjection === 'function' ? disabledInjection?.(formData) : disabledInjection
      return (
        <Fragment key={fIdx}>
          <StringArrayField
            {...field}
            name={fieldName}
            value={formData?.[fieldName]}
            label={(field as any)?.label}
            required={!!required}
            disabled={!!disabled}
            onChangeArray={onChangeObjectSub}
            onRemoveItem={removeItemArraySub as any}
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
