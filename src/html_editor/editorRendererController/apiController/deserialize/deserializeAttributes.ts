import { Attribute } from '../../../types/index'

export const deserializeAttributes = (attributes: Attribute[]): Attribute[] =>
  attributes?.map((attr) => {
    const value = ['style'].includes(attr.attr_name)
      ? (() => {
          try {
            return JSON.parse(attr.attr_value as string)
          } catch (e) {
            console.error('Json parse error, ', e, attr)
            return attr.attr_value
          }
        })()
      : attr.attr_value === 'null'
        ? null
        : attr.attr_value === 'true'
          ? true
          : attr.attr_value === 'false'
            ? false
            : attr.attr_value
    return { ...attr, attr_value: value }
  }) ?? []
