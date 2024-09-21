import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { CTextField } from '../../components/inputs/TextField'
import { mdiPencil, mdiCheck, mdiClose } from '@mdi/js'
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

// no auto-mapping of mdistrings ..
const optionsMdiIcons = {
  mdiPencil: <Icon path={mdiPencil} size={1} />,
  mdiCheck: <Icon path={mdiCheck} size={1} />,
  mdiClose: <Icon path={mdiClose} size={1} />,
  none: null,
} as unknown as any[]

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'inputs/TextField',
  component: CTextField,
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
    icon: { control: 'select', options: optionsMdiIcons },
    startIcon: { control: 'select', options: optionsMdiIcons },
    injectComponent: { control: false },
    // InputProps: { control: 'object' },
    // labelSx: { control: 'object' },
    InputLabelProps: { control: 'object' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onChange: fn() },
} satisfies Meta<typeof CTextField>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Outlined: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    // fullName: 'C Menk',
  },
}

export const OutlinedNotchedLabel: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    useNotchedLabel: true,
    // fullName: 'C Menk',
  },
  argTypes: {
    useNotchedLabel: { control: false },
  },
}

export const OutlinedRounded: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    useNotchedLabel: true,
    borderRadius: 9999,
    // fullName: 'C Menk',
  },
  argTypes: {
    useNotchedLabel: { control: false },
  },
}

export const StandardUnderline: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    variant: 'standard',
  },
  argTypes: {
    useNotchedLabel: { control: false },
  },
}

export const Filled: Story = {
  args: {
    label: 'Label',
    value: 'Value',
    variant: 'filled',
  },
  argTypes: {
    useNotchedLabel: { control: false },
  },
}

const value = 'Value\n\n\n\n\n'
export const TextArea: Story = {
  args: {
    label: 'Label',
    // value: 'Value',
    value,
    // onChange: (newValue) => {
    //   value = newValue
    // },
    multiline: true,
  },
  argTypes: {
    // useNotchedLabel: { control: false },
  },
}
