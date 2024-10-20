import { mdiTable } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { tablePropsSchema } from './tablePropsRawSchema'
import { ComponentDefType } from '../../componentDefType'
import { Table } from '../../../../components/table/Table'
import { uniq } from 'lodash'

export const tableEditorComponentDef = {
  type: 'Table' as const,

  component: Table,
  formGen: ({ editorState }: any) =>
    propertyFormFactory(tablePropsSchema, editorState, {
      // dynamicOptionsDict: {
      //   component: [
      //     { value: undefined, label: 'Default (depends on variant)' },
      //     ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      //   ],
      // },
      onBeforeChange: (newFormData, prevFormData, changedKey, changedValue) => {
        const adjFormData = Object.keys(newFormData).includes('columns')
          ? {
              ...newFormData,
              columns:
                newFormData?.columns?.map?.((col: any) => {
                  const filterOptions = uniq(
                    newFormData?.data
                      ?.map?.((item: any) => item?.[col?.header])
                      ?.filter((val: any) => val)
                  )?.sort((a: any, b: any) => (a > b ? 1 : b > a ? -1 : 0))

                  return {
                    ...col,
                    renderCell: col?.header,
                    renderFooterCell: col?.header,
                    //  (item: any) => (
                    //   <td>{item?.[col?.header ?? '_test_']}</td>
                    // ),
                    sortKey: col?.header,
                    filterKey: col?.header,
                    filterOptions,
                    // getFilterValue: (opt: any) => opt,
                    // getItemLabel: (opt: any) => opt,
                    // getIcon: (row) => <Icon path={mdiPencil} size={1} />,
                  }
                }) ?? [],
            }
          : newFormData
        return adjFormData
      },

      dynamicKeysDict: {
        data: (f: any, g: any) => {
          console.debug('DATA dynamicKeysDict', f, g)
          if (!f?.columns) return []
          const columnHeaders = f?.columns?.map?.(
            (column: any) => column.header
          )

          const columnHeaderDict = columnHeaders.reduce(
            (acc: any, header: any) => {
              acc[header] = ''
              return acc
            },
            {}
          )
          return [columnHeaderDict]
        },
        footerData: (f: any, g: any) => {
          if (!f?.columns) return []
          const columnHeaders = f?.columns?.map?.(
            (column: any) => column.header
          )

          const columnHeaderDict = columnHeaders.reduce(
            (acc: any, header: any) => {
              acc[header] = ''
              return acc
            },
            {}
          )
          return columnHeaderDict
        },
      },
    }),
  props: {
    data: [],
    columns: [
      // {
      //   header: 'name',
      //   renderCell: (item: any) => <td>{item?.name}</td>,
      //   sortKey: 'name',
      //   filterKey: 'name',
      //   filterOptions: ['test', 'test2'],
      //   getFilterValue: (opt: any) => opt,
      //   getItemLabel: (opt: any) => opt,
      // },
      // {
      //   header: 'age',
      //   renderCell: (item: any) => <td>{item?.age}</td>,
      //   sortKey: 'age',
      // },
    ],
    footerData: {},
    filters: [],
  },

  icon: mdiTable,
  category: 'data',
  schema: tablePropsSchema,
}
