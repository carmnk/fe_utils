import { mdiRectangleOutline } from '@mdi/js'
import { NavContainerComponentPropsFormFactory } from './NavContainerPropFormFactory'
import { ComponentDefType } from '../../componentDefType'
import { ExtendedObjectSchemaType } from '../../schemaTypes'

export const navigationContainerDef = {
  type: 'NavContainer' as const,
  props: {
    // children: "test",
    // noWrap: false,
    // align: "inherit",
    // navigationElementId: null,
    children: [],
  },
  formGen: NavContainerComponentPropsFormFactory,
  icon: mdiRectangleOutline,
  category: 'navigation',
  schema: null as unknown as ExtendedObjectSchemaType,
} satisfies ComponentDefType
