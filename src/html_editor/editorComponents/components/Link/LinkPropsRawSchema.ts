import {
  PropertyType,
  ExtendedObjectSchemaType,
  ExtendedSchemaType,
} from '../../schemaTypes'
import { typographyPropsSchema } from '../Typography/typographyPropsRawSchema'

const typographyPropertiesExComponent = Object.keys(
  typographyPropsSchema.properties
).reduce<Record<string, ExtendedSchemaType>>((acc, key) => {
  if (key !== 'component') {
    acc[key] = typographyPropsSchema.properties[key]
  }
  return acc
}, {})
// raw schema to use until schema can be generated reliably from typescript parser/checker
export const linkPropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    href: {
      type: PropertyType.href,
      required: false,
      category: 'shortcut',
    },
    ...typographyPropertiesExComponent,
  },
}
