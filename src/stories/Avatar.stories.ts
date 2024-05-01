import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Avatar } from '../components/basics/Avatar'
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
  title: 'Avatar',
  component: Avatar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    color: { control: 'color' },
    size: { control: 'number' },
    fontSize: { control: 'number' },
    children: { control: false },
    customTooltip: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Initials: Story = {
  args: {
    fullName: 'C Menk',
  },
}

export const Image: Story = {
  args: {
    src: "https://avatars.githubusercontent.com/u/101338?s=460&u=",
    alt: 'Default Avatar',
  },
  argTypes: {
    fontSize: { control: false },
  },
}
export const DefaultAvatar: Story = {
  args: { fullName: 'J D', disableInitials: true },
  argTypes: {
    src: { control: false },
    alt: { control: false },
    bgColor: { control: 'color' },
    color: { control: 'color' },
    disableInitials: { control: false },
    // fullName: { control: false },
  },
}
