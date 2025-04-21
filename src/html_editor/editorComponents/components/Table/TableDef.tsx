import { mdiTable } from '@mdi/js'
import { tablePropsSchema } from './tablePropsRawSchema'
import { ElementModel } from '../../componentDefType'
import { TableProps } from '../../../../components'
import { TableWrapper } from './TableWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

export const tableEditorComponentDef = {
  type: 'Table' as const,

  component: TableWrapper,
  // formGen: ({ editorState }) =>
  //   propertyFormFactory(tablePropsSchema, editorState, {
  //     onBeforeChange: (newFormData) => {
  //       const adjFormData = Object.keys(newFormData).includes('columns')
  //         ? {
  //             ...newFormData,
  //             columns:
  //               (Array.isArray(newFormData?.columns)
  //                 ? newFormData.columns
  //                 : []
  //               )?.map?.((col) => {
  //                 const filterOptions = uniq(
  //                   (Array.isArray(newFormData?.data) ? newFormData.data : [])
  //                     ?.map?.((item) => item?.[col?.header])
  //                     ?.filter((val) => val)
  //                 )?.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))

  //                 return {
  //                   ...col,
  //                   renderCell: col?.header,
  //                   renderFooterCell: col?.header,
  //                   //  (item: any) => (
  //                   //   <td>{item?.[col?.header ?? '_test_']}</td>
  //                   // ),
  //                   sortKey: col?.header,
  //                   filterKey: col?.header,
  //                   filterOptions,
  //                   // getFilterValue: (opt: any) => opt,
  //                   // getItemLabel: (opt: any) => opt,
  //                   // getIcon: (row) => <Icon path={mdiPencil} size={1} />,
  //                 }
  //               }) ?? [],
  //           }
  //         : newFormData
  //       // TODO: Check if type is wrong or code (return) here is wrong
  //       return adjFormData as any
  //     },

  //     dynamicKeysDict: {
  //       data: (f: Record<string, unknown>) => {
  //         if (!f?.columns) return []
  //         const columnHeaders = (
  //           Array.isArray(f?.columns) ? f?.columns : []
  //         )?.map?.((column) => column.header)
  //         const columnHeaderDict = columnHeaders.reduce((acc, header) => {
  //           acc[header] = ''
  //           return acc
  //         }, {})
  //         return [columnHeaderDict]
  //       },
  //       footerData: (f: Record<string, unknown>) => {
  //         if (!f?.columns || !Array.isArray(f.columns)) return []
  //         const columnHeaders = f.columns.map?.((column) => column.header)

  //         const columnHeaderDict = columnHeaders.reduce((acc, header) => {
  //           acc[header] = ''
  //           return acc
  //         }, {})
  //         return columnHeaderDict
  //       },
  //     },
  //   }),
  props: {
    data: [
      { column1: 'Column1 Row1', column2: 'Column2 Row1' },
      { column1: 'Column1 Row2', column2: 'Column2 Row2' },
      { column1: 'Column1 Row3', column2: 'Column2 Row3' },
    ],
    columns: [
      {
        header: 'column1',
        renderCell: (item: any) => <td>{item?.column1}</td>,
        sortKey: 'column1',
        filterKey: 'column1',
        // filterOptions: ['test', 'test2'],
        getFilterValue: (opt: any) => opt,
        getItemLabel: (opt: any) => opt,
      },
      {
        header: 'column2',
        renderCell: (item: any) => <td>{item?.column2}</td>,
        sortKey: 'column2',
      },
    ],
    footerData: {},
    filters: [],
  },

  icon: mdiTable,
  category: 'data',
  schema: tablePropsSchema,
} satisfies ElementModel<TableProps & CommonComponentPropertys>
