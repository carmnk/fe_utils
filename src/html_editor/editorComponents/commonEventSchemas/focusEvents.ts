import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const FOCUS_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onFocus: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'focus',
  },
  onBlur: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'focus',
  },
}
