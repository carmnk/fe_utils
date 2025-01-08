import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const DRAG_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onDrag: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'drag',
  },
  onDragOver: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'drag',
  },
  onDragStart: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'drag',
  },
  onDragEnter: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'drag',
  },
  onDragLeave: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'drag',
  },
  onDrop: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'drag',
  },
}
