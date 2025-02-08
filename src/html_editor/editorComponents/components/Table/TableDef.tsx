import { mdiTable } from '@mdi/js'
import { propertyFormFactory } from '../../propertiesFormFactory'
import { tablePropsSchema } from './tablePropsRawSchema'
import uniq from 'lodash/uniq'
import { ElementModel } from '../../componentDefType'
import { TableProps } from '../../../../components'
import { TableWrapper } from './TableWrapper'
import { CommonComponentPropertys } from '../../componentProperty'

export const tableEditorComponentDef = {
  type: 'Table' as const,

  component: TableWrapper,
  formGen: ({ editorState }) =>
    propertyFormFactory(tablePropsSchema, editorState, {
      // dynamicOptionsDict: {
      //   component: [
      //     { value: undefined, label: 'Default (depends on variant)' },
      //     ...HTML_TAG_NAMES_STRUCTURED_NONVOID_OPTIONS,
      //   ],
      // },
      onBeforeChange: (newFormData) => {
        const adjFormData = Object.keys(newFormData).includes('columns')
          ? {
              ...newFormData,
              columns:
                (Array.isArray(newFormData?.columns)
                  ? newFormData.columns
                  : []
                )?.map?.((col) => {
                  const filterOptions = uniq(
                    (Array.isArray(newFormData?.data) ? newFormData.data : [])
                      ?.map?.((item) => item?.[col?.header])
                      ?.filter((val) => val)
                  )?.sort((a, b) => (a > b ? 1 : b > a ? -1 : 0))

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
        // TODO: Check if type is wrong or code (return) here is wrong
        return adjFormData as any
      },

      dynamicKeysDict: {
        data: (f: Record<string, unknown>) => {
          if (!f?.columns) return []
          const columnHeaders = (
            Array.isArray(f?.columns) ? f?.columns : []
          )?.map?.((column) => column.header)
          const columnHeaderDict = columnHeaders.reduce((acc, header) => {
            acc[header] = ''
            return acc
          }, {})
          return [columnHeaderDict]
        },
        footerData: (f: Record<string, unknown>) => {
          if (!f?.columns || !Array.isArray(f.columns)) return []
          const columnHeaders = f.columns.map?.((column) => column.header)

          const columnHeaderDict = columnHeaders.reduce((acc, header) => {
            acc[header] = ''
            return acc
          }, {})
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
} satisfies ElementModel<TableProps & CommonComponentPropertys>
