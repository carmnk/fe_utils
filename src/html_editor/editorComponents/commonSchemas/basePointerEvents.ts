import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const BASE_POINTER_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onClick: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'basePointer',
  },
  onDoubleClick: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'basePointer',
  },
  onContextMenu: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'basePointer',
  },
}
