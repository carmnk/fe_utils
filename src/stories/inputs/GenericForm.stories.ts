import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { GenericForm } from '../../components/forms/GenericForm'
import { mdiPencil, mdiCheck, mdiClose } from '@mdi/js'

const testFields: any[] = [
  {
    label: 'field1',
    type: 'text',
    name: 'field_1',
    width12: { xs: 12, md: 6 },
    form: {
      showInArrayList: true,
    },
  },
  {
    label: 'field2',
    type: 'text',
    name: 'field_2',
    width12: { xs: 12, md: 6 },
    // fillWidth: true,
  },
  // {
  //   type: 'inject',
  //   name: 'inject_field',
  //   component: () => <div>injected_text</div>,
  // },
  {
    type: 'array',
    name: 'subform',
    label: 'Subform',
    // options: ['option1', 'option2'],
  },
  {
    type: 'select',
    name: 'select_form',
    label: 'SELECT',
    form: {
      showInArrayList: true,
    },
    // options: ['option1', 'option2'],
  },
  {
    type: 'autocomplete',
    name: 'autocomplete',
    label: 'AutoComplete',
    // options: ['option1', 'option2'],
  },
]
const subforms = {
  subform: { fields: testFields },
}

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
  title: 'inputs/GenericForm',
  component: GenericForm,
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
  args: {
    fields: testFields,
    subforms,
    formData: { subform: [{ field_1: 'test', select_form: 'bert' }] },
  },
} satisfies Meta<typeof GenericForm>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
}
