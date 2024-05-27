import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Table } from '../../components/table/Table'
import { mdiPencil, mdiCheck, mdiClose, mdiInformation } from '@mdi/js'
import { Typography } from '@mui/material'
import { TableColumnType } from '../../components/table/types'
import Icon from '@mdi/react'

const optionsMuiColors = [
  'default',
  'inherit',
  'primary',
  'secondary',
  'error',
  'info',
  'success',
  'warning',
]

const optionsMdiIcons = {
  mdiPencil: mdiPencil,
  mdiCheck: mdiCheck,
  mdiClose: mdiClose,
  none: null,
} as unknown as any[]

const testColumns = ({ isSorted, isFiltered }): TableColumnType[] => [
  {
    isRowSelect: true,
    sx: { width: '24px' },
  },
  {
    header: 'id',
    renderCell: (row: any) => (
      <td>
        <Typography>{row.id}</Typography>
      </td>
    ),
    sortKey: isSorted ? 'id' : undefined,
    filterKey: isFiltered ? 'id' : undefined,
    filterOptions: [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
    ],
    getFilterValue: (row: any) => row.value,
    getItemLabel: (row) => row.label,
    getIcon: (row) => <Icon path={mdiPencil} size={1} />,
    // renderFilterKey: (row) => row.value,
  },
  {
    header: 'name',
    renderCell: (row: any) => (
      <td>
        <Typography>{row.name}</Typography>
      </td>
    ),
    sortKey: isSorted ? 'name' : undefined,
    filterKey: isFiltered ? 'name' : undefined,
    filterOptions: ['John Doe', 'Jane Doe', 'John Smith'],
    getFilterValue: (row: any) => row,
    getItemLabel: (row) => row,
    getIcon: (row) => <Icon path={mdiPencil} size={1} />,
  },
  {
    header: 'age',
    renderCell: (row: any) => (
      <td>
        <Typography>{row.age}</Typography>
      </td>
    ),
    sortKey: isSorted ? 'age' : undefined,
    filterKey: isFiltered ? 'age' : undefined,
    filterOptions: [31, 33, 45],
    getFilterValue: (row: any) => row,
    getItemLabel: (row) => row,
    getIcon: (row) => <Icon path={mdiInformation} size={1} />,
  },
]

const testRows = [
  {
    id: 1,
    name: 'John Doe',
    age: 33,
  },
  {
    id: 2,
    name: 'Jane Doe',
    age: 31,
  },
  {
    id: 3,
    name: 'John Smith',
    age: 45,
  },
]

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'table/Table',
  component: Table,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // setPageNumber: { control: false },
    footerBackground: { control: 'color' },
    onSetFilters: { control: false },
    selectedRows: { control: 'multi-select', options: [1, 2, 3] },

    // color: { control: 'color' },
    // size: { control: 'number' },
    // fontSize: { control: 'number' },
    // children: { control: 'text' },
    // customTooltip: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onUnselectAllFilters: fn(),
    onReorder: fn(),
    onSelectAllFilters: fn(),
    onSelectRow: fn(),
    onSetFilters: fn(),
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    columns: testColumns({}),
    getSelectedRow: (item: any) => item.id,
    data: testRows,
  },
}
export const NoData: Story = {
  args: {
    columns: testColumns({}),
    getSelectedRow: (item: any) => item.id,
    data: [],
    noResultsLabel: 'No data found in this test',
    disableNoResults: false,
  },
}
export const Sorted: Story = {
  args: {
    columns: testColumns({ isSorted: true }),
    getSelectedRow: (item: any) => item.id,
    data: testRows,
  },
}
export const AllFiltered: Story = {
  args: {
    columns: testColumns({ isSorted: true, isFiltered: true }),
    getSelectedRow: (item: any) => item.id,
    data: testRows,
  },
}
