import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Switch } from '../../components/inputs/Switch'
import { mdiPencil, mdiCheck, mdiClose } from '@mdi/js'
import { JsonField } from '../../components/inputs/JsonField'

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
  title: 'inputs/JsonField',
  component: JsonField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    value: { control: 'boolean' },
    // label: { control: 'text' },

    // color: { control: 'color' },
    // size: { control: 'number' },
    // fontSize: { control: 'number' },
    // children: { control: 'text' },
    // customTooltip: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onChange: fn() },
} satisfies Meta<typeof JsonField>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    value: { label: 'label', value: 1 },
    keysDict: {
      thisIsAnOption: 'with default text',
    },
    // fullName: 'C Menk',
  },
}
