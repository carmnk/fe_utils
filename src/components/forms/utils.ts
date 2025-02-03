import { DynamicFieldDefinition, StaticFieldDefinition } from './fields/Field'
import { FormDataType, GenericFormProps } from './types'

export const getInjectedValue = (
  param: ((value: unknown) => unknown) | unknown,
  formData: FormDataType,
  rootFormData: FormDataType | undefined
) =>
  (typeof param === 'function' ? param?.(formData, rootFormData) : param) ??
  undefined

export const getDynamicFields = (params: {
  fields: GenericFormProps['fields'] // StaticFieldDefinition[] | ((formData: any) => StaticFieldDefinition[])
  injections: GenericFormProps['injections']
  formData: Record<string, unknown>
  rootFormData: Record<string, unknown>
}): DynamicFieldDefinition[] => {
  const { fields: fieldsIn, injections, formData, rootFormData } = params

  const fields =
    typeof fieldsIn === 'function'
      ? fieldsIn?.(formData, rootFormData)
      : fieldsIn
  const getInjectedValue = (param: ((value: unknown) => unknown) | unknown) =>
    (typeof param === 'function' ? param?.(formData, rootFormData) : param) ??
    undefined
  const dynamicFields = fields?.map((field) => {
    const injectDynamics = field?.name
      ? {
          disabled: getInjectedValue(injections?.disabled?.[field.name]),
          required: getInjectedValue(injections?.required?.[field.name]),
          options: getInjectedValue(injections?.options?.[field.name]),
          error: getInjectedValue(injections?.error?.[field.name]),
          helperText: getInjectedValue(injections?.helperText?.[field.name]),
          invisible: getInjectedValue(injections?.invisible?.[field.name]),
          hidden: getInjectedValue(injections?.hidden?.[field.name]),
          keysDict: getInjectedValue(injections?.keysDict?.[field.name]),
        }
      : {}
    return {
      ...field,
      ...injectDynamics,
    }
  })
  return dynamicFields
}

export const getInitialFieldValues = (
  fieldsIn: StaticFieldDefinition[]
): { [key: string]: unknown } => {
  return fieldsIn.reduce((acc, cur) => {
    if (!cur?.name) return acc
    return {
      ...acc,
      [cur.name]: cur?.type === 'array' ? [] : cur?.type === 'object' ? {} : '',
    }
  }, {})
}
