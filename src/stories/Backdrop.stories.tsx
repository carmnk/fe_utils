import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Backdrop } from '../components/feedback/Backdrop'
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
  title: 'Backdrop without Fullscreen',
  component: Backdrop,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Backdrop>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const DisablePortal: Story = {
  args: {
    disablePortal: true,
    sx: { width: '40px', height: '40px' },
    open: true,
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
