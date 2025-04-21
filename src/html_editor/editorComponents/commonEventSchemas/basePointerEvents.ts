import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const BASE_POINTER_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onClick: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'click',
  },
  onDoubleClick: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'click',
  },
  onContextMenu: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'click',
  },
}
