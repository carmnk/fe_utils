import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Modal } from '../components/surfaces/Modal'
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
  title: 'Modal',
  component: Modal,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    borderRadius: { control: 'number' },
    buttonBorderRadiuses: { control: 'number' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const NonConfirmationDialog: Story = {
  args: {
    header: 'Modal Header',
    subheader: 'Modal Subheader',
    // slotProps: { backdrop: { sx: {width: "500 !important"} } },
    sx: { width: '600px !important' },
    // slotProps: { paper: { sx: { top: '0 !important', left: '0 !important' } } },
    // PaperProps: { sx: { top: 0, left: 0 } },
    open: true,
    // nonConfirmationButtonProps: { borderRadius: 9999 },
    nonConfirmationLabel: 'Okay',

    hideBackdrop: true,
    disablePortal: true,
    onClose: fn(),
    children: 'Modal Content',
    width: 600,
  },
}

export const ConfirmationDialog: Story = {
  args: {
    isConfirmation: true,
    header: 'Modal Header',
    subheader: 'Modal Subheader',
    // slotProps: { backdrop: { sx: {width: "500 !important"} } },
    sx: { width: '600px !important' },
    // slotProps: { paper: { sx: { top: '0 !important', left: '0 !important' } } },
    // PaperProps: { sx: { top: 0, left: 0 } },
    open: true,
    hideBackdrop: true,
    disablePortal: true,
    onClose: fn(),
    children: 'Modal Content',
    confirmationLabel: 'Yeah!',
    confirmationTooltip: 'Confirm',
    confirmationIcon: mdiCheck,

    cancelConfirmationLabel: 'Nope',
    cancelConfirmationIcon: mdiClose,
    slotProps: { cancelConfirmButton: { variant: 'outlined' } },
    width: 600,
  },
}

export const ConfirmationWithTwoOptionsDialog: Story = {
  args: {
    isConfirmation: true,
    header: 'Modal Header',
    subheader: 'Modal Subheader',
    // slotProps: { backdrop: { sx: {width: "500 !important"} } },
    sx: { width: '600px !important' },
    // slotProps: { paper: { sx: { top: '0 !important', left: '0 !important' } } },
    // PaperProps: { sx: { top: 0, left: 0 } },
    open: true,

    confirmationLabel: 'Yeah!',
    confirmationTooltip: 'Confirm',
    confirmationIcon: mdiCheck,
    secondaryActionIcon: mdiPencil,
    secondaryActionLabel: 'Edit',
    slotProps: { secondaryButton: { variant: 'outlined' } },
    onSecondaryAction: fn(),

    hideBackdrop: true,
    disablePortal: true,
    onClose: fn(),
    children: 'Modal Content',
    width: 600,
  },
}
