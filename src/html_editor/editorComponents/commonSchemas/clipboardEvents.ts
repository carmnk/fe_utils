import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const CLIPBOARD_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onCopy: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'clipboard',
  },
  onPaste: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'clipboard',
  },
  onCut: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'clipboard',
  },
}
