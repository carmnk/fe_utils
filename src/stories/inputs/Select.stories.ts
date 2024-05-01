import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Select } from '../../components/inputs/Select'
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
  title: 'inputs/Select',
  component: Select,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    maxLength: { control: 'number' },
    variant: {
      control: 'select',
      options: ['standard', 'outlined' /*'filled'*/],
    },
    // icon: { control: 'select', options: optionsMdiIcons },
    // startIcon: { control: 'select', options: optionsMdiIcons },
    // injectComponent: { control: false },
    // InputProps: { control: 'object' },
    labelSx: { control: 'object' },
    onChange: { control: 'function' },
    size: { control: 'select', options: ['small', 'medium'] },
    // InputLabelProps: { control: 'object' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onClick: fn(),
    options: [
      {
        value: 'value1',
        label: 'label1',
      },
      { value: 'value2', label: 'label2' },
    ],
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    label: 'Label',
    value: 'value1',
  },
}
