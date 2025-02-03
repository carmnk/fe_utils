import { Attribute } from "../../../types"

export const serializeAttributes = (attributes: Attribute[]) =>
  attributes?.map((attr) => {
    const attr_value = ['function', 'object'].includes(typeof attr.attr_value)
      ? JSON.stringify(attr.attr_value)
      : // :
        // typeof attr.attr_value === 'string' &&
        //   attr.attr_value.startsWith('blob:')
        // ? attr.attr_value.slice(attr.attr_value.lastIndexOf('/') + 1)
        attr.attr_value
    return { ...attr, attr_value }
  }) || []
