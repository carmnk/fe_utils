import { mdiContentCopy } from '@mdi/js'
import { Box } from '@mui/material'
import { Button } from '../buttons/Button'

export const CopiedIconOnCopy = (props: { copied: boolean }) => {
  const { copied } = props
  return (
    <Box
      position="absolute"
      top="0px"
      right="0px"
      sx={{
        transition: `opacity ${copied ? '0.8s' : '2s'} ease-out 0s`,
        opacity: copied ? 1 : 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Button iconButton disableTabstop icon={mdiContentCopy}></Button>
    </Box>
  )
}
