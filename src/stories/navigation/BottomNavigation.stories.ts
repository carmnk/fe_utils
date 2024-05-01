import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { BottomNavigation } from '../../components/navigation/BottomNavigation'
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
  title: 'navigation/BottomNavigation',
  component: BottomNavigation,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // color: { control: 'color' },
    // size: { control: 'number' },
    // fontSize: { control: 'number' },
    // children: { control: 'text' },
    // customTooltip: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof BottomNavigation>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    value: '',
    items: [
      { value: 'Val1', label: 'Label1', icon: mdiPencil },
      { value: 'Val2', label: 'Label2', icon: mdiCheck },
    ],
    // fullName: 'C Menk',
  },
}
