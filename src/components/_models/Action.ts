import { ReactNode } from 'react'

export type UserActionDef = {
  value?: string
  label: string
  tooltip?: string | ReactNode
  disabled?: boolean
  icon?: ReactNode
  loading?: boolean
}

export type UserAction = UserActionDef & {
  onClick: () => void
}
