import { CSSProperties, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { AvatarProps as MAvatarProps, Avatar as MAvatar } from '@mui/material'
import { Tooltip, Box, Typography } from '@mui/material'
import { Flex } from '../_wrapper/Flex'

const DEFAULT_AVATAR_BG_COLOR = '#DEE2EA'

export type AvatarProps = Omit<MAvatarProps, 'title'> & {
  size?: CSSProperties['width']
  fullName?: string
  fontSize?: CSSProperties['fontSize']
  disableInitials?: boolean
  customTooltip?: React.ReactNode
  bgColor?: string
}
export const Avatar = (props: AvatarProps) => {
  const {
    size = 26,
    src,
    fullName,
    style,
    fontSize,
    disableInitials,
    customTooltip,
    bgColor,
    ...rest
  } = props

  const avatarStyles = useMemo(
    () => ({
      width: size,
      height: size,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: bgColor ?? DEFAULT_AVATAR_BG_COLOR,
      color: bgColor ? '#fff' : 'primary.main',
      ...style,
      ...(rest?.sx ?? {}),
    }),
    [size, style, rest?.sx, bgColor]
  )
  const imageStyles = useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: 99999,
      ...style,
    }),
    [size, style]
  )

  const initials = useMemo(
    () =>
      typeof fullName === 'string'
        ? fullName.split(' ')[0].slice(0, 1)[0] +
          fullName.split(' ')[1].slice(0, 1)[0]
        : '',
    [fullName]
  )

  return src ? (
    <Flex alignItems="center" justifyContent="center" width="max-content">
      <Tooltip
        placement="top"
        arrow
        title={customTooltip ?? fullName}
        disableInteractive
      >
        <Box
          component="img"
          style={imageStyles}
          src={src}
          alt="profile"
          {...rest}
        />
      </Tooltip>
    </Flex>
  ) : (
    <Tooltip
      placement="top"
      arrow
      title={customTooltip ?? fullName}
      disableInteractive
    >
      <MAvatar {...rest} sx={avatarStyles}>
        {fullName && !disableInitials ? (
          <Typography variant="caption" fontSize={fontSize} lineHeight={1}>
            {initials}
          </Typography>
        ) : null}
      </MAvatar>
    </Tooltip>
  )
}
