import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { CAutoComplete } from '../../components/inputs/AutoComplete'
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
  title: 'inputs/CAutoComplete',
  component: CAutoComplete,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    renderGroup: { control: false },
    renderInput: { control: false },
    renderOption: { control: false },
    renderTags: { control: false },
    onChange: { control: false },
    onKeyUp: { control: false },
    label: { control: 'text' },
    maxLength: { control: 'number' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn(), onChange: fn(), onKeyUp: fn() },
} satisfies Meta<typeof CAutoComplete>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    value: 'value1',
    options: [
      {
        value: 'value1',
        label: 'label1',
      },
      { value: 'value2', label: 'label2' },
    ],
    // fullName: 'C Menk',
  },
}
