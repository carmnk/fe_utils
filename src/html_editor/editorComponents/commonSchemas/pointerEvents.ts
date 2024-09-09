import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const POINTER_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onPointerOver: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
  onPointerEnter: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
  onPointerDown: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
  onPointerUp: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
  onPointerMove: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
  onPointerLeave: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
  onPointerOut: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
  onPointerCancel: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'pointer',
  },
}
