import { Button, CButtonProps } from '../Button/Button'
import { ButtonType } from '../Button/defs'

// explicit
// type ButtonGroupButtonProps = Pick<
//   CButtonProps,
//   'icon' | 'tooltip' | 'onClick'
// > & {
//   value: string
//   selected: boolean
//   disabled?: boolean
//   iconButton?: boolean
//   label?: string
// }

export type ButtonGroupButtonProps = CButtonProps & {
  selected: boolean
}

export const ButtonGroupButton = (props: ButtonGroupButtonProps) => {
  const { selected, ...buttonProps } = props
  return (
    <Button
      type={selected ? ButtonType.primary : ButtonType.text}
      {...buttonProps}
    />
  )
}
