import { ReactNode } from 'react'


import Icon from '@mdi/react'
import { Chip, ChipProps } from '@mui/material'

export type CChipProps = ChipProps & { icon?: string }

export const CChip = (props: CChipProps) => {
  return (
    <Chip
      {...props}
      icon={
        props?.icon ? (
          <Icon
            path={props.icon}
            size={'16px'}
            style={{ marginLeft: '8px' }}
          ></Icon>
        ) : undefined
      }
    />
  )
}


export type ChipWrapperProps = CChipProps & {
  rootInjection: ReactNode
}
export const ChipWrapper = (props: ChipWrapperProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, rootInjection, label, ...rest } = props
  const labelComponent = (
    <>
      {label}
      {rootInjection}
    </>
  )
  return <CChip {...rest} label={labelComponent}></CChip>
}
