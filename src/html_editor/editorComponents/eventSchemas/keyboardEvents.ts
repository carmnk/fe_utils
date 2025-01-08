import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const KEYBOARD_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onKeyDown: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'keyboard',
  },
  onKeyUp: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'keyboard',
  },
  onKeyPress: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'keyboard',
  },
}
