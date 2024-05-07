import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Button } from '../components/buttons/Button/Button'
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
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    borderRadius: { control: 'number' },
    color: { options: optionsMuiColors },
    iconSize: { control: 'number' },
    iconColor: { control: 'color' },
    fontColor: { control: 'color' },
    children: { control: false },
    icon: {
      options: optionsMdiIcons as any,
    },
    endIcon: {
      options: optionsMdiIcons as any,
    },
    dropdown: { options: ['closed', 'open'] },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ContainedButton: Story = {
  args: {
    label: 'Contained',
  },
}

export const OutlinedButton: Story = {
  args: {
    variant: 'outlined',
    label: 'Outlined',
  },
}

export const TextButton: Story = {
  args: {
    variant: 'text',
    label: 'Text',
  },
}

export const ContainedIconButton: Story = {
  args: {
    // variant: 'text',
    label: 'Text',
    iconButton: true,
    icon: optionsMdiIcons.mdiPencil,
  },
}

export const OutlinedIconButton: Story = {
  args: {
    variant: 'outlined',
    label: 'Text',
    iconButton: true,
    icon: optionsMdiIcons.mdiPencil,
  },
}

export const TextIconButton: Story = {
  args: {
    // variant: 'text',
    label: 'Text',
    iconButton: true,
    icon: optionsMdiIcons.mdiPencil,
  },
}
