import { Stack, StackProps } from '@mui/material'
export type FlexProps = StackProps
export const Flex = (props: StackProps) => {
  return <Stack direction="row" {...props} />
}
