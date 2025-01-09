import { Property } from '../../../types/property'

export const serializeProperties = (properties: Property[]) =>
  properties?.map((prop) => {
    const prop_value = ['function', 'object'].includes(typeof prop.prop_value)
      ? JSON.stringify(prop.prop_value)
      : prop.prop_value
    return { ...prop, prop_value }
  }) || []
