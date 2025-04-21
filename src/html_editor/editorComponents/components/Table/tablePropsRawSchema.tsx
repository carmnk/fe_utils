import { PropertyType, ExtendedObjectSchemaType } from '../../schemaTypes'

// raw schema to use until schema can be generated reliably from typescript parser/checker
export const tablePropsSchema: ExtendedObjectSchemaType = {
  type: PropertyType.Object,
  required: true,
  properties: {
    data: {
      type: PropertyType.Array,
      required: false,
      form: {
        defaultValue: [
          { column1: 'Column1 Row1', column2: 'Column2 Row1' },
          { column1: 'Column1 Row2', column2: 'Column2 Row2' },
          { column1: 'Column1 Row3', column2: 'Column2 Row3' },
        ],
      },
      items: [
        {
          type: PropertyType.Object,
          properties: {
            // nodeId: {
            //   type: PropertyType.String,
            //   required: true,
            // },
            label: {
              type: PropertyType.String,
              required: true,
              form: {
                showInArrayList: true,
                defaultValue: '',
              },
            },

            // children: {
            //   type: PropertyType.Array,
            //   required: false,
            // },
          },
        },
      ],
      label: 'Data',
      category: 'data',
    },
    columns: {
      type: PropertyType.Array,
      required: false,
      form: {
        defaultValue: [
          {
            header: 'column1',
            renderCell: (item: { column1: string }) => <td>{item?.column1}</td>,
            sortKey: 'column1',
            filterKey: 'column1',
            // filterOptions: ['test', 'test2'],
            getFilterValue: (opt: string) => opt,
            getItemLabel: (opt: string) => opt,
          },
          {
            header: 'column2',
            renderCell: (item: { column2: string }) => <td>{item?.column2}</td>,
            sortKey: 'column2',
          },
        ],
      },
      items: [
        {
          type: PropertyType.Object,
          properties: {
            header: {
              type: PropertyType.String,
              required: false,
              form: {
                defaultValue: '',
                showInArrayList: true,
              },
            },
          },
        },
      ],
      category: 'data',
    },
    footerData: {
      type: PropertyType.json,
      required: false,
      form: {
        defaultValue: {},
      },
      label: 'Footer-Data',
      category: 'data',
    },
    // children: {
    //   type: PropertyType.String,
    //   required: true,
    // },

    loading: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    loadingRows: {
      type: PropertyType.Number,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    headerBackground: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    footerBackground: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    noResultsLabel: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    clearFilersOnNoResultLabel: {
      type: PropertyType.String,
      required: false,
      form: {
        // defaultValue: 'transparent',
      },
      category: 'shortcut',
    },
    disableClearFiltersOnNoResults: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableSelection: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableNoResults: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },
    disableTableHeader: {
      type: PropertyType.Boolean,
      required: false,
      form: {
        defaultValue: false,
      },
      category: 'shortcut',
    },

    // sx: {
    //   type: PropertyType.Object,
    //   required: false,
    //   properties: {},
    // },
  },
}
