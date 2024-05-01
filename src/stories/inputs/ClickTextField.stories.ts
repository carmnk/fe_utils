import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ClickTextField } from '../../components/inputs/ClickTextField'
import { mdiPencil, mdiCheck, mdiClose } from '@mdi/js'

const genericInputFieldType = [
  'text',
  'number',
  'int',
  'date',
  'select',
  'autocomplete',
  'multiselect',
  'textarea',
  'bool',
  'switch',
  'file',
]
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
  title: 'inputs/ClickTextField',
  component: ClickTextField,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: { control: { options: genericInputFieldType } },
    // color: { control: 'color' },
    // size: { control: 'number' },
    // fontSize: { control: 'number' },
    // children: { control: 'text' },
    // customTooltip: { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    onChange: fn(),
    onClickAway: fn(),
    onToggle: fn(),
    handleRemoveItem: fn(),
  },
} satisfies Meta<typeof ClickTextField>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Text: Story = {
  args: {
    variant: 'text',
    value: 'Input Value',
  },
}
export const TextWithDifferentTypography: Story = {
  args: {
    variant: 'text',
    value: 'Input Value',
    typographyProps: { variant: 'body2', fontWeight: 400 },
  },
}
export const Select: Story = {
  args: {
    variant: 'select',
    value: 'opt1',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ],
    typographyProps: { variant: 'body2', fontWeight: 400 },
  },
}

export const AutoComplete: Story = {
  args: {
    variant: 'autocomplete',
    value: 'opt1',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ],
    typographyProps: { variant: 'body2', fontWeight: 400 },
  },
}
export const NumberField: Story = {
  args: {
    variant: 'number',
    value: '1.23',
    typographyProps: { variant: 'body2', fontWeight: 400 },
  },
}

export const DateFieldUntested: Story = {
  args: {
    variant: 'date',
    value: '2024-02-15',
    typographyProps: { variant: 'body2', fontWeight: 400 },
  },
}
export const MultiSelectUntested: Story = {
  args: {
    variant: 'multiselect',
    value: 'opt1',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ],
    typographyProps: { variant: 'body2', fontWeight: 400 },
  },
}
export const TextAreaUntested: Story = {
  args: {
    variant: 'textarea',
    value: 'opt1',
    options: [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
    ],
    typographyProps: { variant: 'body2', fontWeight: 400 },
  },
}
