import { ExtendedObjectSchemaType, PropertyType } from '../schemaTypes'

export const ANIMATION_EVENTS: ExtendedObjectSchemaType['properties'] = {
  onAnimationEnd: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'animation',
  },
  onAnimationStart: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'animation',
  },
  onAnimationIteration: {
    type: PropertyType.eventHandler,
    required: false,
    category: 'events',
    eventType: 'animation',
  },
}
