import { mdiTreeOutline } from '@mdi/js'
import { propertyFormFactory } from '@cmk/fe_utils'
import { treeViewPropsSchema } from './treeViewPropsRawSchema'
import { CTreeView } from '@cmk/fe_utils'
import { ComponentDefType } from '../../componentDefType'

export const treeViewDef: ComponentDefType = {
  type: 'TreeView' as const,

  component: CTreeView,
  formGen: ({ editorState }) =>
    propertyFormFactory(treeViewPropsSchema, editorState, {
      // dynamicOptionsDict: {
      //   component: [
      //     { value: undefined, label: 'Default (depends on variant)' },
      //     ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      //   ],
      // },
      // onBeforeChange: (newFormData, prevFormData, changedKey, changedValue) => {
      //   const adjFormData = Object.keys(newFormData).includes('columns')
      //     ? {
      //         ...newFormData,
      //         columns: newFormData?.columns?.map((col: any) => {
      //           return {
      //             ...col,
      //             renderCell: col?.header,
      //             renderFooterCell: col?.header,
      //             //  (item: any) => (
      //             //   <td>{item?.[col?.header ?? '_test_']}</td>
      //             // ),
      //             sortKey: col?.header,
      //             filterKey: col?.header,
      //             filterOptions: uniq(
      //               newFormData?.data
      //                 ?.map((item: any) => item?.[col?.header])
      //                 .filter((val: any) => val)
      //             ).sort((a: any, b: any) => (a > b ? 1 : b > a ? -1 : 0)),
      //             // getFilterValue: (opt: any) => opt,
      //             // getItemLabel: (opt: any) => opt,
      //             // getIcon: (row) => <Icon path={mdiPencil} size={1} />,
      //           }
      //         }),
      //       }
      //     : newFormData
      //   return adjFormData
      // },
      // dynamicKeysDict: {
      //   data: (f: any, g: any) => {
      //     const columnHeaders = f?.columns?.map((column: any) => column.header)
      //     const columnHeaderDict = columnHeaders.reduce(
      //       (acc: any, header: any) => {
      //         acc[header] = 'test'
      //         return acc
      //       },
      //       {}
      //     )
      //     return [columnHeaderDict]
      //   },
      // },
    }),
  props: {
    items: [
      { nodeId: '1', label: 'One' },
      { nodeId: '2', parentId: '1', label: 'Two' },
    ],
    // columns: [],
    // footerData: { name: '-', age: 'avg 25' },
    // filters: [],

    // items: StyledTreeItemProps[];
    // expandedItems?: []
  },

  icon: mdiTreeOutline,
  category: 'data',
  schema: treeViewPropsSchema,
}
