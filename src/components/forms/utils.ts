import { DynamicFieldDefinition, StaticFieldDefinition } from './fields/Field'
import { GenericFormProps } from './GenericForm'

export const getInjectedValue = (
  param: ((value: any) => any) | any,
  formData: any,
  rootFormData: any
) =>
  (typeof param === 'function' ? param?.(formData, rootFormData) : param) ??
  undefined

export const getDynamicFields = (params: {
  fields: GenericFormProps['fields'] // StaticFieldDefinition[] | ((formData: any) => StaticFieldDefinition[])
  injections: GenericFormProps['injections']
  formData: any
  rootFormData: any
}): DynamicFieldDefinition[] => {
  const { fields: fieldsIn, injections, formData, rootFormData } = params

  const fields =
    typeof fieldsIn === 'function'
      ? fieldsIn?.(formData, rootFormData)
      : fieldsIn
  const getInjectedValue = (param: ((value: any) => any) | any) =>
    (typeof param === 'function' ? param?.(formData, rootFormData) : param) ??
    undefined
  const dynamicFields = fields?.map((field) => {
    const injectDynamics = field?.name
      ? {
          disabled: getInjectedValue(injections?.disabled?.[field.name]),
          required: getInjectedValue(injections?.required?.[field.name]),
          options: getInjectedValue(injections?.options?.[field.name]),
          error: getInjectedValue(injections?.error?.[field.name]),
          helperText: getInjectedValue(
            injections?.helperText?.[field.name]
          ) as any,
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
  return dynamicFields as any
}

export const getInitialFieldValues = (
  fieldsIn: StaticFieldDefinition[]
): { [key: string]: any } => {
  return fieldsIn.reduce((acc, cur) => {
    if (!cur?.name) return acc
    return {
      ...acc,
      [cur.name]: cur?.type === 'array' ? [] : cur?.type === 'object' ? {} : '',
    }
  }, {})
}
