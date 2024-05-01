import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { DropdownMenu } from '../components/dropdown/DropdownMenu'
import { mdiPencil, mdiCheck, mdiClose } from '@mdi/js'

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

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'DropdownMenu',
  component: DropdownMenu,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
   },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    anchorEl: { control: false },
    // color: { options: optionsMuiColors },
    // iconSize: { control: 'number' },
    // iconColor: { control: 'color' },
    // fontColor: { control: 'color' },
    // children: { control: false },
    // icon: {
    //   options: optionsMdiIcons,
    // },
    // endIcon: {
    //   options: optionsMdiIcons,
    // },
    // dropdown: { options: ['closed', 'open'] },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    sx: { position: 'absolute', width: 300, height: 300 },
    slotProps: { paper: { sx: { top: '0 !important', left: '0 !important' } } },
    // PaperProps: { sx: { top: 0, left: 0 } },

    open: true,
    anchorEl: null as any,
    disablePortal: true,
    onClose: fn(),
    items: [
      {
        label: 'Item 1',
        id: 'item1',
        onClick: fn(),
      },
      {
        label: 'Item 2',
        id: 'item2',
        onClick: fn(),
      },
    ],
  },
}

// export const Secondary: Story = {
//   args: {
//     variant: 'outlined',
//     label: 'Outlined',
//   },
// }

// export const Text: Story = {
//   args: {
//     variant: 'text',
//     label: 'Text',
//   },
// }
