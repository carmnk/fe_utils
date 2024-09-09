import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const UI_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onScroll: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'ui',
  },
  onSelect: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'ui',
  },
  onResize: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'ui',
  },
  // ONLY FOR BODY element!
  //   onLoad: {
  //     type: PropertyType.eventHandler,
  //     required: false,
  //     category: 'events',
  //     //   returnType: { type: PropertyType.Void },
  //   },
  //   onBeforeUnload: {
  //     type: PropertyType.eventHandler,
  //     required: false,
  //     category: 'events',
  //     //   returnType: { type: PropertyType.Void },
  //   },
  //   onUnload: {
  //     type: PropertyType.eventHandler,
  //     required: false,
  //     category: 'events',
  //     //   returnType: { type: PropertyType.Void },
  //   },
  //   onAbort: {
  //     type: PropertyType.eventHandler,
  //     required: false,
  //     category: 'events',
  //     //   returnType: { type: PropertyType.Void },
  //   },
  //   onError: {
  //     type: PropertyType.eventHandler,
  //     required: false,
  //     category: 'events',
  //     //   returnType: { type: PropertyType.Void },
  //   },
}
