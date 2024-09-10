import { useRef, useEffect, useState, useCallback } from 'react'
import Tooltip from '@mui/material/Tooltip'
import {
  Box,
  BoxProps,
  // Link as MuiLink,
  Typography,
  TypographyProps,
} from '@mui/material'
import { CopyClipboardContext } from '../utils/CopyClipboardContext'
import { CopiedIconOnCopy } from '../utils/CopyClipboardCopyIcon'

export type EllipsisTextWithTooltipProps = BoxProps & {
  label?: string
  title?: string
  spanSx?: any
  permanentTitle?: string
  to?: string
  useCopyContent?: boolean
  onClick?: () => void
  fullWidth?: boolean
  outerBoxSx?: BoxProps['sx']
  useTypography?: boolean
  typographyVariant?: TypographyProps['variant']
}

export const EllipsisTextWithTooltip = (
  props: EllipsisTextWithTooltipProps
) => {
  const {
    label,
    title,
    sx,
    spanSx,
    permanentTitle,
    // to,
    useCopyContent,
    onClick,
    fullWidth,
    outerBoxSx,
    useTypography,
    typographyVariant,
  } = props

  // Define state and function to update the value
  const [hoverStatus, setHover] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    setCopied(true)
  }, [])

  const titleAdj = !hoverStatus ? '' : (title ? title : label) || ''
  const permanentTitleAdj =
    (permanentTitle && hoverStatus ? (
      <>
        {permanentTitle}
        <br />
      </>
    ) : (
      permanentTitle
    )) || ''

  const fullTitle = (
    <>
      {permanentTitleAdj} {titleAdj}
    </>
  )
  // Create Ref
  const textElementRef = useRef<HTMLDivElement>(null)

  // compare once and add resize listener on "componentDidMount"
  useEffect(() => {
    const compareSize = () => {
      if (!textElementRef?.current) return
      const compare =
        textElementRef?.current?.scrollWidth >
        textElementRef?.current?.clientWidth
      setHover(compare)
    }
    compareSize()
    window.addEventListener('resize', compareSize)

    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [])

  useEffect(() => {
    if (!copied) return
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [copied])

  return (
    <CopyClipboardContext
      text={typeof label === 'string' ? label : ''}
      onCopy={handleCopy}
      disableCopy={!useCopyContent || typeof label !== 'string'}
    >
      <Box
        position="relative"
        width={fullWidth ? '100%' : undefined}
        sx={outerBoxSx}
      >
        <Tooltip
          title={fullTitle}
          disableHoverListener={!hoverStatus && !permanentTitle}
          placement="top"
          arrow
          sx={{ zIndex: 1000000 }}
        >
          <Box
            ref={textElementRef}
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              position: 'relative',
              ...sx,
            }}
            onClick={onClick}
          >
            {
              // to ? (
              //   <Box component="span" sx={spanSx}>
              //     <Link to={to}>
              //       <MuiLink component="div">{label}</MuiLink>
              //     </Link>
              //   </Box>
              // ) :
              useTypography ? (
                <Typography
                  variant={typographyVariant}
                  component="div"
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    position: 'relative',
                  }}
                >
                  {label}
                </Typography>
              ) : (
                <Box component="span" sx={spanSx}>
                  {label}
                </Box>
              )
            }
          </Box>
        </Tooltip>

        {useCopyContent && <CopiedIconOnCopy copied={copied} />}
      </Box>
    </CopyClipboardContext>
  )
}
