import { ReactNode } from 'react'
import { ElementCategory } from './componentDefType'

export enum PropertyType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Int = 'int',
  Object = 'object',
  Array = 'array',
  Function = 'function',
  children = 'children',
  icon = 'icon',
  json = 'json',
  eventHandler = 'eventHandler',
  href = 'href',
  imageSrc = 'imageSrc',
  buttonGroup = 'buttonGroup',
  cssSize = 'cssSize',
  cssSizeArray = 'cssSizeArray',
  cssSpacing = 'cssSpacing',
  cssGap = 'cssGap',
  color = 'color',
  cssBorder = 'cssBorder',
  cssBorderRadius = 'cssBorderRadius',
  cssBackground = 'cssBackground',
  navControlElementId = 'navControlElementId',
  cssTextShadow = 'cssTextShadow',
  cssTextDecoration = 'cssTextDecoration',
}

type EnumOptionType = string | number | { value: string; label: string }

export type LiteralType = StringType | NumberType | BooleanType | IntType

export type SchemaType<IsExtendedType extends boolean = false> = FormProps &
  ((
    | LiteralType
    | ObjectSchemaType<IsExtendedType>
    | ArraySchemaType
    | FunctionType
    | ChildrenType
    | IconType
    | HrefType
    | ImageSrcType
    | NavControlElementIdType
    | ButtonGroupType
    | CssSizeType
    | CssSizeArrayType
    | CssGapType
    | CssBorderType
    | CssBackgroundType
    | CssSpacingType
    | CssBorderRadiusType
    | CssTextShadowType
    | CssTextDecorationType
    | ColorType
    | JsonType
    | EventHandlerType
  ) & { label?: string }) // is label used ???

type FormProps = {
  uiType?: string
  form?: {
    width12?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
    fillWidth?: boolean
    label?: string
    placeholder?: string
    helpText?: string
    disabled?: boolean
    hidden?: boolean
    invisible?: boolean
    defaultValue?:
      | string
      | number
      | boolean
      | Record<string, unknown>
      | unknown[]
    showInArrayList?: boolean
    type?: 'autocomplete' // | 'textarea' | 'number' | 'checkbox' | 'radio'
  }
  eventType?: string
  objectPropertyToApply?: 'sx'
}
export type ExtendedSchemaType = SchemaType<true> &
  FormProps & {
    category?: ElementCategory
  }

export type StringType = {
  type: PropertyType.String
  required?: boolean // JSON Schema -> required is outside of property definition and includes all required properties
  pattern?: RegExp // -> is string in JSON Schema
  // multipleOf?: number  -> from Copilot ... !?
  maxLength?: number
  minLength?: number
  enum?: EnumOptionType[]
  groupBy?: (item: unknown) => string | number | undefined
}

export type NumberType = {
  type: PropertyType.Number
  required?: boolean // JSON Schema -> required is outside of property definition and includes all required properties
  minimum?: number
  maximum?: number
  multipleOf?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  isInteger?: boolean
  enum?: EnumOptionType[]
}
export type IntType = {
  type: PropertyType.Int
  required?: boolean // JSON Schema -> required is outside of property definition and includes all required properties
  minimum?: number
  maximum?: number
  multipleOf?: number
  exclusiveMinimum?: number
  exclusiveMaximum?: number
  isInteger?: boolean
  enum?: EnumOptionType[]
}

export type BooleanType = {
  type: PropertyType.Boolean
  //   enum: [false, true] // -> for schema
  required?: boolean // JSON Schema -> ...
}

export type ObjectSchemaType<IsExtendedType extends boolean = false> = {
  type: PropertyType.Object
  required?: boolean // JSON Schema -> ...
  properties: Record<
    string,
    IsExtendedType extends true
      ? ExtendedSchemaType
      : SchemaType & { category?: ElementCategory }
  >
  // like properties but with regex property keys / names -> e.g. "^S_": -> matches e.g. 'S_123': ...
  patternProperties?: Record<
    string,
    IsExtendedType extends true ? ExtendedSchemaType : SchemaType
  >
  additionalProperties?: boolean | IsExtendedType extends true
    ? ExtendedSchemaType
    : SchemaType // optional props
  propertyNames?: PropertyType
  maxProperties?: number
  minProperties?: number
  dependencies?: Record<string, string[]>
}
export type ExtendedObjectSchemaType = ObjectSchemaType<true> & FormProps

export type ArraySchemaType<IsExtendedType extends boolean = false> = {
  type: PropertyType.Array
  required?: boolean // JSON Schema -> ...
  items: (IsExtendedType extends true ? ExtendedSchemaType : SchemaType)[] // -> items is an array in JSON Schema
  minItems?: number
  // less common
  maxItems?: number
  uniqueItems?: boolean // all items shall be unique
  additionalItems?: boolean | SchemaType
}

export type ExtendedArraySchemaType = ArraySchemaType<true> & FormProps

export type FunctionType = {
  type: PropertyType.Function
  required?: boolean // JSON Schema -> ...

  parameters: { [k: string]: SchemaType[] }
  returnType?: SchemaType
}

export type ChildrenType = {
  type: PropertyType.children
  required?: boolean
}

export type IconType = {
  type: PropertyType.icon
  required?: boolean
  enum: EnumOptionType[]
}

export type HrefType = {
  type: PropertyType.href
  required?: boolean
}
export type ButtonGroupType = {
  type: PropertyType.buttonGroup
  required?: boolean
  iconButtons: { value: string; icon: ReactNode }[]
}
export type ImageSrcType = {
  type: PropertyType.imageSrc
  required?: boolean
}
export type NavControlElementIdType = {
  type: PropertyType.navControlElementId
  required?: boolean
}
export type CssSizeType = {
  type: PropertyType.cssSize
  required?: boolean
}
export type CssSizeArrayType = {
  type: PropertyType.cssSizeArray
  required?: boolean
}
export type CssSpacingType = {
  type: PropertyType.cssSpacing
  required?: boolean
}
export type CssGapType = {
  type: PropertyType.cssGap
  required?: boolean
}
export type CssBorderType = {
  type: PropertyType.cssBorder
  required?: boolean
}
export type CssBorderRadiusType = {
  type: PropertyType.cssBorderRadius
  required?: boolean
}
export type CssTextShadowType = {
  type: PropertyType.cssTextShadow
  required?: boolean
}
export type CssTextDecorationType = {
  type: PropertyType.cssTextDecoration
  required?: boolean
}
export type CssBackgroundType = {
  type: PropertyType.cssBackground
  required?: boolean
}
export type ColorType = {
  type: PropertyType.color
  required?: boolean
}

export type JsonType = {
  type: PropertyType.json
  required?: boolean
  keysDict?: Record<string, string>
  items?: ObjectSchemaType[]
}
export type EventHandlerType = {
  type: PropertyType.eventHandler
  required?: boolean
}
