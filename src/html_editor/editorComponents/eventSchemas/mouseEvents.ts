import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const MOUSE_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onMouseOver: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
  onMouseEnter: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
  onMouseUp: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
  onMouseDown: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
  onMouseMove: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
  onMouseLeave: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
  onMouseOut: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
  onWheel: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'mouse',
  },
}
