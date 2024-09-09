import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const TOUCH_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onTouchStart: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'touch',
  },
  onTouchMove: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'touch',
  },
  onTouchEnd: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'touch',
  },
  onTouchCancel: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'touch',
  },
}
