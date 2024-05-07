import { Button, CButtonProps } from '../Button/Button'

export type ButtonGroupButtonProps = CButtonProps & {
  selected: boolean
}

export const ButtonGroupButton = (props: ButtonGroupButtonProps) => {
  const { selected, ...buttonProps } = props
  return <Button variant={selected ? 'contained' : 'text'} {...buttonProps} />
}
